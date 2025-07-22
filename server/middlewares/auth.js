import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
    try {
        const { userId } = req.auth();
        const user = await clerkClient.users.getUser(userId);
        if (!user || user.privateMetadata.role !== 'admin') {
            return res.status(403).send({ success: false, message: "Access denied." });
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "not Authorised. Error Occurred" });
    }
};