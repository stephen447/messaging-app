// Functions for handling user related requests
import db from '../models/index.js'; // Adjust the path as necessary
const { User, Message } = db;
import { Op } from 'sequelize'; // Import Op from Sequelize
/**
 * Save a new message to the database.
 * @param {string} content - The content of the message.
 * @param {number} userId - The ID of the user sending the message.
 * @returns {Promise<Object>} The created message object or an error message.
 */
export async function createMessage(content, userId, endUserId) {
  if (typeof content !== 'string' || typeof userId !== 'number') {
    return { status: 400, message: 'Invalid input' };
  }

  try {
    // Check if the user exists
    const userExists = await User.findByPk(userId);
    const endUserExists = await User.findByPk(endUserId);
    if (!userExists) {
      return { status: 404, message: 'User not found' };
    }

    // Create a new message
    const newMessage = await Message.create({ message: content, fromUserId: userId, toUserId:endUserId });
    return { status: 201, message: 'Message created successfully', data: newMessage };
  } catch (error) {
    console.error('Error creating message:', error);
    return { status: 500, message: 'Internal Server Error' };
  }
}

/**
 * Get all messages from the database.
 * @returns {Object} Status Code and the list of messages.
 */
export async function getAllMessages() {
  try {
    const messages = await Message.findAll();
    return { status: 200, message: 'Messages retrieved successfully', data: messages };
  } catch (error) {
    console.error('Error retrieving messages:', error);
    return { status: 500, message: 'Internal Server Error' };
  }
}

/**
 * Get messages exchanged between two users.
 * @param {number} userId1 - The ID of the first user.
 * @param {number} userId2 - The ID of the second user.
 * @returns {Promise<Object>} The list of messages between the two users.
 */
export async function getMessagesBetweenUsers(userId1, userId2) {
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { fromUserId: userId1, toUserId: userId2 },
          { fromUserId: userId2, toUserId: userId1 }
        ]
      },
      order: [['createdAt', 'ASC']] // Order by the time messages were sent
    });

    if (!messages.length) {
      return { status: 404, message: 'No messages found between these users' };
    }

    return { status: 200, message: 'Messages retrieved successfully', data: messages };
  } catch (error) {
    console.error('Error retrieving messages:', error);
    return { status: 500, message: 'Internal Server Error' };
  }
}