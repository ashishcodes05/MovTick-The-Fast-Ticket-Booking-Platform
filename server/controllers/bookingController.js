import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import stripe from "stripe";
import dayjs from "dayjs";

//function to check availabilty of selected seats for a movie
const checkSeatsAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId);
        if (!showData) {
            return false;
        }
        const occupiedSeats = showData.occupiedSeats;
        
        // Check if any of the selected seats are already occupied
        // Handle both Map and Object types for backward compatibility
        const isAnySeatOccupied = selectedSeats.some(seat => {
            let isOccupied = false;
            if (occupiedSeats instanceof Map) {
                isOccupied = occupiedSeats.has(seat);
            } else if (occupiedSeats && typeof occupiedSeats === 'object') {
                isOccupied = !!occupiedSeats[seat];
            }
            return isOccupied;
        });
        return !isAnySeatOccupied;
    } catch (error) {
        console.error("Error checking seat availability:", error);
        return false;
    }
}

export const createBooking = async (req, res) => {
    const { userId } = req.auth();
    const { showId, selectedSeats } = req.body;
    const { origin } = req.headers;
    if (!showId || !selectedSeats || selectedSeats.length === 0) {
        return res.status(400).send({ success: false, message: "Show ID and selected seats are required." });
    }
    try {
        // Check if the selected seats are available
        const isAvailable = await checkSeatsAvailability(showId, selectedSeats);
        if (!isAvailable) {
            return res.status(400).send({ success: false, message: "Selected seats are not available." });
        }
        const showData = await Show.findById(showId).populate('movie');
        if (!showData) {
            return res.status(404).send({ success: false, message: "Show not found." });
        }
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats,
        });
        selectedSeats.forEach(seat => {
            // Ensure occupiedSeats is initialized as Map
            if (!showData.occupiedSeats || !(showData.occupiedSeats instanceof Map)) {
                showData.occupiedSeats = new Map();
            }
            showData.occupiedSeats.set(seat, userId); // Mark the seat as occupied
        });
        await booking.save(); // Save the booking
        await showData.save(); // Save the updated show data
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
        const line_items = [{
            price_data: {
                currency: 'inr',
                product_data: {
                    name: showData.movie.title,
                    description: `Booking for ${showData.movie.title} on ${dayjs(showData.showTime).format('MMMM Do YYYY, h:mm A')}`,
                },
                unit_amount: Math.floor(booking.amount) * 100, // Convert to cents
            },
            quantity: 1,
        }]

        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${origin}/loading/my-bookings`,
            cancel_url: `${origin}/my-bookings`,
            metadata: {
                bookingId: booking._id.toString(),
                userId: userId,
                showId: showId,
            },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes expiration
        });
        booking.paymentLink = session.url;
        await booking.save(); // Save the booking with the payment link

        return res.status(201).send({ success: true, url: session.url });
    } catch (error) {
        console.error("Error creating booking:", error);
        return res.status(500).send({ success: false, message: "Internal server error." });
    }
}

export const getOccupiedSeats = async (req, res) => {
    try {
        const { showId } = req.params;
        const show = await Show.findById(showId);
        if (!show) {
            return res.status(404).send({ success: false, message: "Show not found." });
        }
        
        let occupiedSeats = [];
        // Handle both Map and Object types for backward compatibility
        if (show.occupiedSeats instanceof Map) {
            occupiedSeats = Array.from(show.occupiedSeats.keys());
        } else if (show.occupiedSeats && typeof show.occupiedSeats === 'object') {
            occupiedSeats = Object.keys(show.occupiedSeats);
        }
        
        return res.status(200).send({ success: true, occupiedSeats });
    } catch (error) {
        console.error("Error fetching occupied seats:", error);
        return res.status(500).send({ success: false, message: "Internal server error. " + error.message });
    }
};
