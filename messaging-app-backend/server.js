import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dbConnection from './db.js'
import user from "./routes/user.js";
import messages from "./routes/message.js";
import * as Message from "./controllers/message.js";

const app = express(); // Express app
const server = createServer(app);

// CORS configuration - allow requests from your frontend server
const corsOptions = {
  origin: 'http://localhost:3000',  // Allow requests from your frontend server
  optionsSuccessStatus: 200,        
};
// Enable CORS map
app.use(cors(corsOptions));
// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Use the user routes for requests to /user
app.use(user);
app.use(messages);
// User connection map
const userConnections = {};
// Endpoint to get all online users
app.get('/users/v1/online-users', (req, res) => {
  const usersOnline = Object.keys(userConnections);
  // get the online users
  res.json(usersOnline);
});

// Create a new instance of the socket.io server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from your frontend server
    methods: ['GET', 'POST'],
  },
});

// Testing the connection to the database
dbConnection.sync({ force: true }).then(() => {
  console.log('Database & tables created!');
});
// Define the port to run the server on
const PORT = process.env.PORT || 5001;

// Event listener for new connections
io.on('connection', (socket) => {
  console.log('New client connected');
  // Store user's socket ID by their user ID
  socket.on('register', (userId) => {
    userConnections[userId] = socket.id;
    console.log(`User ${userId} connected with socket ID ${socket.id}`);
    io.emit('userStatus', { userId, status: 'online' });
  });

  // Handle incoming messages
  socket.on('message', async (data) => {
    const content = data.content;
    const fromUserId = data.userId;
    const toUserId = data.endUserID;
    console.log(`Message from ${fromUserId} to ${toUserId}: ${content}`);
    try {
      const response = await Message.createMessage(content, fromUserId, toUserId);
      if (response.status === 201) {
        const recipientSocketId = userConnections[toUserId];
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('message', response.data); // Send message to specific user
        } else {
          console.log(`User ${toUserId} is not connected`);
        }
      } else {
        socket.emit('error', response.message); // Emit error to the sender
      }
    } catch (error) {
      console.error('Error creating message:', error);
      socket.emit('error', 'Internal Server Error');
    }
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // Remove user from connection map
    for (const [userId, socketId] of Object.entries(userConnections)) {
      if (socketId === socket.id) {
        delete userConnections[userId];
        // I need to emit the userStatus event to all connected users
        io.emit('userStatus', { userId, status: 'offline' });
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
