import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";

//API Controller Function for User Bookings
export const getUserBookings = async (req, res) => {
    try {
        const auth = req.auth();
        if (!auth || !auth.userId) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication required" 
            });
        }
        
        const user = auth.userId;
        const bookings = await Booking.find({ user }).populate({
            path: "show",
            populate: { path: "movie" }
        }).sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
}

export const toggleFavoriteShow = async (req, res) => {
    try {
        const auth = req.auth();
        if (!auth || !auth.userId) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication required" 
            });
        }
        
        const userId = auth.userId;
        const { movieId } = req.body;

        if (!movieId) {
            return res.status(400).json({
                success: false,
                message: "Movie ID is required"
            });
        }

        const user = await clerkClient.users.getUser(userId);

        // Initialize favourites if it doesn't exist
        if (!user.privateMetadata.favourites) {
            user.privateMetadata.favourites = [];
        }
        
        let favourites = [...user.privateMetadata.favourites];
        
        if (!favourites.includes(movieId)) {
            favourites.push(movieId);
        } else {
            favourites = favourites.filter(id => id !== movieId);
        }
        
        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: { favourites }
        });
        
        res.status(200).json({ success: true, favourites });
    } catch (error) {
        console.error("Error toggling favorite show:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
}

export const getFavourites = async (req, res) => {
    try {
        console.log("getFavourites called");
        
        // Get userId from Clerk auth
        const auth = req.auth();
        if (!auth || !auth.userId) {
            console.error("No auth or userId found");
            return res.status(401).json({ 
                success: false, 
                message: "Authentication required" 
            });
        }
        
        const userId = auth.userId;
        console.log("User ID:", userId);
        
        console.log("Fetching user from Clerk...");
        const user = await clerkClient.users.getUser(userId);
        console.log("User found:", user.id);
        
        const favourites = user.privateMetadata?.favourites || [];
        console.log("User favourites:", favourites);
        
        if (favourites.length === 0) {
            console.log("No favourites found");
            return res.status(200).json({ 
                success: true, 
                movies: [] 
            });
        }
        
        console.log("Fetching movies from database...");
        const movies = await Movie.find({ _id: { $in: favourites } });
        console.log("Movies found:", movies.length);
        
        res.status(200).json({ success: true, movies });
    } catch (error) {
        console.error("Error fetching favorite shows:", error);
        console.error("Error details:", error.message);
        
        if (error.status === 404) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
}