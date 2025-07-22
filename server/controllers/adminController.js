import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";
import { clerkClient } from "@clerk/express";

//API to check if user is admin
export const isAdmin = async (req, res) => {
    try {
        console.log("isAdmin endpoint called");
        
        const auth = req.auth();
        if (!auth || !auth.userId) {
            console.log("No authentication found");
            return res.status(401).json({
                success: false,
                isAdmin: false,
                message: "Authentication required"
            });
        }
        
        const userId = auth.userId;
        console.log("Checking admin status for user:", userId);
        
        const user = await clerkClient.users.getUser(userId);
        const isUserAdmin = user.privateMetadata?.role === 'admin';
        
        console.log("User admin status:", isUserAdmin);
        
        res.status(200).json({
            success: true,
            isAdmin: isUserAdmin,
            message: isUserAdmin ? "User is an admin" : "User is not an admin"
        });
    } catch (error) {
        console.error("Error checking admin status:", error);
        res.status(500).json({
            success: false,
            isAdmin: false,
            message: "Internal server error"
        });
    }
}

//API to get dashboard data
export const getDashboardData = async (req, res) => {
    try {
        const bookings = await Booking.find({isPaid: true});
        const activeShows = await Show.find({}).populate('movie');
        const totalUsers = await User.countDocuments();
        const totalBookings = await Booking.countDocuments({isPaid: true});
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.amount, 0);
        const dashboardData = {
            totalUsers,
            totalBookings,
            totalRevenue,
            activeShows
        }
        res.send({
            success: true,
            dashboardData
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error fetching dashboard data.",
            error: error.message
        });
    }
}

export const getAllShows = async (req, res) => {
    try {
        const shows = await Show.find({}).populate('movie').sort({ showDateTime: 1 });
        if (!shows || shows.length === 0) {
            return res.status(404).send({ success: false, message: "No shows found." });
        }
        res.send({ success: true, shows });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error fetching shows.",
            error: error.message
        });
    }
}

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user').populate({
            path: 'show',
            populate: {
                path: 'movie'
            }
        }).sort({ createdAt: -1 });
        if (!bookings || bookings.length === 0) {
            return res.status(404).send({ success: false, message: "No bookings found." });
        }
        res.send({ success: true, bookings });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error fetching bookings.",
            error: error.message
        });
    }
}

