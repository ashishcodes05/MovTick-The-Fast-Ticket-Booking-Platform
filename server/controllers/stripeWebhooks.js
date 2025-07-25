import stripe from "stripe";
import Booking from "../models/Booking.js";

export const stripeWebhookHandler = async (req, res) => {
    const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Handle the event
    try {
        switch (event.type) {
            case "payment_intent.succeeded":
                const paymentIntent = event.data.object;
                const sessionList = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                });
                const session = sessionList.data[0];
                
                await Booking.findByIdAndUpdate(session.metadata.bookingId, {
                    isPaid: true,
                    paymentLink: "",
                });
                break;
            default:
                console.warn(`Unhandled event type: ${event.type}`);
            }
    } catch (error) {
        console.error(`Error handling webhook event: ${error.message}`);
        res.status(500).send(`Error handling webhook event: ${error.message}`);
    }
    res.json({ received: true });
}