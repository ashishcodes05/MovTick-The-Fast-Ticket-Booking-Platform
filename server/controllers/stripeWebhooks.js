import stripe from "stripe";
import Booking from "../models/Booking.js";

export const stripeWebhookHandler = async (req, res) => {
    console.log("=== STRIPE WEBHOOK RECEIVED ===");
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    console.log("Body type:", typeof req.body);
    console.log("Body length:", req.body ? req.body.length : 0);
    
    const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"];
    let event;
    
    if (!sig) {
        console.error("No stripe-signature header found");
        return res.status(400).send("No stripe-signature header found");
    }
    
    try {
        event = stripeInstance.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        console.log("Webhook event constructed successfully:", event.type);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    try {
        console.log(`Processing event: ${event.type}`);
        
        switch (event.type) {
            case "checkout.session.completed":
                const session = event.data.object;
                console.log("Checkout session completed:", session.id);
                console.log("Session metadata:", session.metadata);
                console.log("Payment status:", session.payment_status);
                
                if (session.payment_status === 'paid' && session.metadata && session.metadata.bookingId) {
                    console.log("Updating booking:", session.metadata.bookingId);
                    
                    const updatedBooking = await Booking.findByIdAndUpdate(
                        session.metadata.bookingId, 
                        {
                            isPaid: true,
                            paymentLink: "",
                        },
                        { new: true }
                    );
                    
                    if (updatedBooking) {
                        console.log("Booking updated successfully:", updatedBooking._id, "isPaid:", updatedBooking.isPaid);
                    } else {
                        console.error("Booking not found with ID:", session.metadata.bookingId);
                    }
                } else {
                    console.error("Payment not completed or no bookingId found");
                    console.error("Payment status:", session.payment_status);
                    console.error("Metadata:", session.metadata);
                }
                break;
                
            case "payment_intent.succeeded":
                const paymentIntent = event.data.object;
                console.log("Payment intent succeeded:", paymentIntent.id);
                
                // Fallback: try to find session by payment intent
                const sessionList = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                });
                
                if (sessionList.data.length > 0) {
                    const session = sessionList.data[0];
                    console.log("Found session via payment intent:", session.id);
                    
                    if (session.metadata && session.metadata.bookingId) {
                        const updatedBooking = await Booking.findByIdAndUpdate(
                            session.metadata.bookingId,
                            {
                                isPaid: true,
                                paymentLink: "",
                            },
                            { new: true }
                        );
                        console.log("Booking updated via payment intent:", updatedBooking);
                    }
                } else {
                    console.log("No session found for payment intent:", paymentIntent.id);
                }
                break;
                
            default:
                console.warn(`Unhandled event type: ${event.type}`);
        }
    } catch (error) {
        console.error(`Error handling webhook event: ${error.message}`);
        console.error("Error stack:", error.stack);
        return res.status(500).send(`Error handling webhook event: ${error.message}`);
    }
    
    console.log("Webhook processed successfully");
    res.json({ received: true });
}

// Test webhook endpoint (remove in production)
export const testWebhook = async (req, res) => {
    console.log("Test webhook called");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    res.json({ message: "Test webhook received" });
}