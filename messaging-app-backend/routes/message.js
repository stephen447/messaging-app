// File containing the user routes
import express from "express";
import * as message from "../controllers/message.js";
const router = express.Router();

// Create User
router.get("/message/v1/getMessage", async (req, res) => {
	// Get sending user ID from the request
    const userId = req.query.userId;
    // Get receiving user ID from the request
    const endUserId = req.query.endUserId;
    if(!userId || !endUserId) {
        res.status(400).send("Invalid input");
        return;
    }
    // Get the message send between the two users
    const response = await message.getMessagesBetweenUsers(userId, endUserId);
    // Return the new user object
    res.status(response.status).send(response.data);
});

// Get the last message between a user and everyone else
router.get("/message/v1/getLastMessage", async (req, res) => {
    // Get sending user ID from the request
    const userId = req.query.userId;
    if(!userId) {
        res.status(400).send("Invalid input");
        return;
    }
    // Get the message send between the two users
    const response = await message.getLastMessages(userId);
    // Return the new user object
    res.status(response.status).send(response.data);
});
export default router;