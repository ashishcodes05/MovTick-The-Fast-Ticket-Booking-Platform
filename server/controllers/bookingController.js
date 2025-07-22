import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import stripe from "stripe";

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
        await showData.save(); // Save the updated show data
        return res.status(201).send({ success: true, message: "Booked Successfully", booking });
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
