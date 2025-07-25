import express from 'express';
import { createBooking, getOccupiedSeats, updatePaymentStatus } from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post("/create", createBooking);
bookingRouter.get("/seats/:showId", getOccupiedSeats);
bookingRouter.patch("/payment-status/:bookingId", updatePaymentStatus); // Test endpoint

export default bookingRouter;
