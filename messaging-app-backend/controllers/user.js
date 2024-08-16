// Functions for handling user related requests
import db from '../models/index.js'; // Adjust the path as necessary
const { User } = db;

/**
 * Get all users from the database.
 * @returns {Object} Status Code and the list of all usernames.
 */
export async function getAllUsers() {
    try {
        // Get all users from the database
        const users = await User.findAll();
        
        // Extract usernames from the list of users
        const userNames = users.map(user => ({
            id: user.id,
            username: user.username
          }));
          
        
        return {status: 200, message: 'Users retrieved successfully', data: userNames};
    } catch (error) {
        console.error('Error retrieving users:', error);
        return {status: 500, message: 'Internal Server Error'};
    }
}

/**
 * Create a new user in the database.
 * @param {string} username - The username of the new user.
 * @returns {Promise<Object>} The created user object or an error message.
 */
export async function createUser(username) {
    // Check if the username is a string
    if (typeof username !== 'string') {
        return {status: 400, message: 'Username must be a string'};
    }
    try {
        // Check if username already exists
        const existingUser = await User.findOne({ where: { username } });

        // If username already exists, return a 409 status code
        if (existingUser) {
            return { status: 409, message: 'Username already exists' };
        }

        // Create a new user
        const newUser = await User.create({ username });
        return {status: 201, message: 'User created successfully', data: newUser};
    } catch (error) {
        console.error('Error creating user:', error);
        return {status: 500, message: 'Internal Server Error'};
    }
}
/**
 * Get a user by their ID.
 * @param {number} userId - The ID of the user to retrieve.
 * @returns {Object} Status Code and the retrieved user object.
 */
export async function getUserById(userId) {
    try {
        // Get the user from the database
        const user = await User.findByPk(userId);
        if (!user) {
            return { status: 404, message: 'User not found' };
        }
        return { status: 200, message: 'User retrieved successfully', data: user };
    } catch (error) {
        console.error('Error retrieving user:', error);
        return { status: 500, message: 'Internal Server Error' };
    }
}
