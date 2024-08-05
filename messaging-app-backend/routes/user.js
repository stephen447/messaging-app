// File containing the user routes
import express from "express";

const router = express.Router();

router.post("/v1/createUser", async (req, res) => {
	// Get the username from the body
    // Check if it already exists in the database
    // If it does not exist, create a new user
    // Return the new user object
});

// Create user

// Get all users
router.get("/v1/getAllUsers", async (req, res) => {
    // Get all users from the database
    // Return the list of users
    res.status(200).send("User Test Sucessful"); 
});

// Get user by ID

// Update user

// Delete user

// Export the router
export default router;