// File containing the user routes
import express from "express";
import * as user from "../controllers/user.js";
const router = express.Router();

// Create User
router.post("/user/v1/createUser", async (req, res) => {
	// Get the username from the body
    const username = req.body.username;
    // Check if it already exists in the database
    if(!username){
        return res.status(400).send("Username is required");
    }
    // If it does not exist, create a new user
    const response = await user.createUser(username);
    // Return the new user object
    res.status(response.status).send(response.message);
});

// Get all users
router.get("/user/v1/getAllUsers", async (req, res) => {
    // Get all users from the database
    const users = await user.getAllUsers();
    // Return the list of users
    res.status(200).send(users.data); 
});

// Get user by ID

// Update user

// Delete user

// Export the router
export default router;