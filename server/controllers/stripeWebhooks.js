import stripe from "stripe";
import Booking from "../models/Booking.js";

export const stripeWebhookHandler = async (req, res) => {
    const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"];
    let event;
    
    if (!sig) {
        return res.status(400).send("No stripe-signature header found");
    }
    
    try {
        event = stripeInstance.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    try {
        switch (event.type) {
            case "checkout.session.completed":
                const session = event.data.object;
                
                if (session.payment_status === 'paid' && session.metadata && session.metadata.bookingId) {
                    await Booking.findByIdAndUpdate(
                        session.metadata.bookingId, 
                        {
                            isPaid: true,
                            paymentLink: "",
                        },
                        { new: true }
                    );
                }
                break;
                
            case "payment_intent.succeeded":
                const paymentIntent = event.data.object;
                
                // Fallback: try to find session by payment intent
                const sessionList = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                });
                
                if (sessionList.data.length > 0) {
                    const session = sessionList.data[0];
                    
                    if (session.metadata && session.metadata.bookingId) {
                        await Booking.findByIdAndUpdate(
                            session.metadata.bookingId,
                            {
                                isPaid: true,
                                paymentLink: "",
                            },
                            { new: true }
                        );
                    }
                }
                break;
                
            default:
                console.warn(`Unhandled event type: ${event.type}`);
        }
    } catch (error) {
        console.error(`Error handling webhook event: ${error.message}`);
        return res.status(500).send(`Error handling webhook event: ${error.message}`);
    }
    
    res.json({ received: true });
}

// Test webhook endpoint (remove in production)
export const testWebhook = async (req, res) => {
    res.json({ message: "Test webhook received" });
}