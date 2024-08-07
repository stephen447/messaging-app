import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dbConnection from './db.js'
import user from "./routes/user.js";
import * as Message from "./controllers/message.js";

const app = express(); // Express app
const server = createServer(app);

// CORS configuration - allow requests from your frontend server
const corsOptions = {
  origin: 'http://localhost:3000',  // Allow requests from your frontend server
  optionsSuccessStatus: 200,        // Some legacy browsers choke on 204
};
// Enable CORS
app.use(cors(corsOptions));
// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Use the user routes for requests to /user
app.use(user);

// Create a new instance of the socket.io server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow requests from your frontend server
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
  // Event listener for messages
  socket.on('message', async (message) => {
    try {
      console.log(`Message received: ${message.content}`);
      
      // Save message to the database
      const newMessage = await Message.createMessage(message.content, message.userId, message.endUserID);

      // Emit the saved message to all connected clients
      io.emit('message', newMessage.message);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });
  // Event listener for disconnections
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
