import { Inngest } from "inngest";
import User from "../models/User.js";

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

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];