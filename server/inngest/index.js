import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import { model } from "mongoose";
import sendEmail from "../configs/nodeMailer.js";
import dayjs from "dayjs";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Inngest function to store user data in database
const syncUserCreation = inngest.createFunction(
    {id: "sync-user-from-clerk"},
    { event: "clerk/user.created" },
    async ({ event }) => {
        try {
            console.log("Received user creation event:", event.data);
            const { id, first_name, last_name, email_addresses, image_url } = event.data;
            
            // Check if required fields exist
            if (!id || !email_addresses || email_addresses.length === 0) {
                console.error("Missing required user data:", { id, email_addresses });
                return;
            }
            
            const userData = {
                _id: id,
                name: `${first_name || ''} ${last_name || ''}`.trim(),
                email: email_addresses[0].email_address,
                image: image_url || ''
            }
            
            console.log("Creating user with data:", userData);
            const createdUser = await User.create(userData);
            console.log("User created successfully:", createdUser);
        } catch (error) {
            console.error("Error creating user:", error);
        }
    }
)

//Inngest function to handle user deletion
const syncUserDeletion = inngest.createFunction(
    {id: "sync-user-deletion"},
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        try {
            console.log("Received user deletion event:", event.data);
            const { id } = event.data;
            if (!id) {
                console.error("Missing user ID for deletion");
                return;
            }
            const deletedUser = await User.findByIdAndDelete(id);
            console.log("User deleted successfully:", deletedUser);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    }
)

//Inngest function to handle user updates
const syncUserUpdation = inngest.createFunction(
    {id: "sync-user-updation"},
    { event: "clerk/user.updated" },
    async ({ event }) => {
        try {
            console.log("Received user update event:", event.data);
            const { id, first_name, last_name, email_addresses, image_url } = event.data;
            
            if (!id) {
                console.error("Missing user ID for update");
                return;
            }
            
            const userData = {
                name: `${first_name || ''} ${last_name || ''}`.trim(),
                email: email_addresses?.[0]?.email_address,
                image: image_url || ''
            }
            
            console.log("Updating user with data:", userData);
            const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
            console.log("User updated successfully:", updatedUser);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    }
)

//Inngest function to cancel booking and release seats of show after 10 minutes of booking created if payment is not made
const releaseSeatsAndDeleteBooking = inngest.createFunction(
    { id: "release-seats-and-delete-booking" },
    { event: "app/checkpayment"},
    async ({ event, step }) => {
        const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
        await step.sleepUntil('wait-for-10-minutes', tenMinutesLater);

        await step.run('check-payment-status', async () => {
            const { bookingId } = event.data;
            
            const booking = await Booking.findById(bookingId);
            
            if (!booking) {
                return;
            }
            
            //If payment is not made, release seats and delete booking
            if(!booking.isPaid) {
                const show = await Show.findById(booking.show);
                if (show) {
                    // Handle both Map and Object types for backward compatibility
                    if (show.occupiedSeats instanceof Map) {
                        booking.bookedSeats.forEach(seat => {
                            show.occupiedSeats.delete(seat);
                        });
                    } else if (show.occupiedSeats && typeof show.occupiedSeats === 'object') {
                        booking.bookedSeats.forEach(seat => {
                            delete show.occupiedSeats[seat];
                        });
                        show.markModified('occupiedSeats');
                    }
                    
                    await show.save();
                }
                
                await Booking.findByIdAndDelete(bookingId);
            }
        })

    }
)

//inngest function to send confirmation email after booking is created
const sendBookingConfirmationEmail = inngest.createFunction(
    { id: "send-booking-confirmation-email" },
    { event: "app/show.booked" },
    async ({ event }) => {
        const { bookingId } = event.data;
        const booking = await Booking.findById(bookingId).populate({
            path: 'show',
            populate: {
                path: 'movie',
                model: 'Movie'
            }
        }).populate('user');
        if (!booking) {
            console.error("Booking not found:", bookingId);
            return;
        }
        await sendEmail({
            to: booking.user.email,
            subject: `Booking Confirmation for ${booking.show.movie.title}`,
            body: `
                <h1>Booking Confirmation</h1>
                <p>Thank you for booking tickets for ${booking.show.movie.title}.</p>
                <p>Your booking details are as follows:</p>
                <p>Show Date: ${new Date(booking.show.showDateTime).toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" })}</p>
                <p>Show Time: ${new Date(booking.show.showDateTime).toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata" })}</p>
                <p>Booked Seats: ${booking.bookedSeats.join(', ')}</p>
                <p>Total Amount: ₹${booking.amount}</p>
                <p>We hope you enjoy the show!</p>
            `
        })
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation, releaseSeatsAndDeleteBooking, sendBookingConfirmationEmail];