// Functions for handling user related requests
import db from '../models/index.js'; // Adjust the path as necessary
const { User, Message } = db;
import * as user from "../controllers/user.js";
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

export async function getLastMessages(userId) {
  try {
    // Get a list of all users 
    let users = await user.getAllUsers();
    // Convert the object to an array
    users = users.data;
    console.log(users);
    const messagesWithUsers = [];

    // Loop through all users and get the last message between userId and each user
    for (const user of users) {
      //exclude the user itself
      if(user.id === userId){
        continue;
      }
      const lastMessage = await Message.findOne({
        where: {
          [Op.or]: [
            { fromUserId: userId, toUserId: user.id },
            { fromUserId: user.id, toUserId: userId }
          ]
        },
        order: [['createdAt', 'DESC']],
        limit: 1
      });
      console.log(lastMessage);
      // If a message exists, push it to the array along with the user details
      messagesWithUsers.push({
        username: user.username,
        userId: user.id,
        message: lastMessage ? lastMessage.dataValues.message : 'No message found', // Handle case where no message exists
        createdAt: lastMessage ? lastMessage.createdAt : null,
        online: false
      });
    }

    return {
      status: 200,
      message: 'Messages retrieved successfully',
      data: messagesWithUsers
    };
  } catch (error) {
    console.error('Error retrieving messages:', error);
    return {
      status: 500,
      message: 'Internal Server Error'
    };
  }
}