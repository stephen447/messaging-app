import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express(); // Express app
const server = createServer(app);

// CORS configuration - allow requests from your frontend server
const corsOptions = {
  origin: 'http://localhost:3000',  // Allow requests from your frontend server
  optionsSuccessStatus: 200,        // Some legacy browsers choke on 204
};
// Enable CORS
app.use(cors(corsOptions));

// Create a new instance of the socket.io server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow requests from your frontend server
    methods: ['GET', 'POST'],
  },
});

// Define the port to run the server on
const PORT = process.env.PORT || 5001;

// Event listener for new connections
io.on('connection', (socket) => {
  console.log('New client connected');
  // Event listener for messages
  socket.on('message', (message) => {
    console.log(`Message received: ${message}`);
    io.emit('message', message);
  });
  // Event listener for disconnections
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
