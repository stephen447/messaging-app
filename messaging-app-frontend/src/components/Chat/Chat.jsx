import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { userStore } from "../../UserStore";

const Chat = () => {
  // State variables for the message input and messages
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  // Get the current user and the reciepient user from the user store
  const currentUser = userStore.getCurrentUser;
  const reciepientUser = userStore.getReciepientUser;

  useEffect(() => {
    // Establish socket connection
    const newSocket = io("http://localhost:5001", {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });
    // Set the socket in state
    setSocket(newSocket);

    // Add event listeners for the socket
    newSocket.on("connect", () => {
      console.log("Connected to server");
      registerUser(currentUser.id); // Register the test user ID here
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    newSocket.on("reconnect_attempt", (attemptNumber) => {
      console.log(`Reconnect attempt ${attemptNumber}`);
    });

    newSocket.on("reconnect_error", (error) => {
      console.error("Reconnect error:", error);
    });

    newSocket.on("reconnect_failed", () => {
      console.error("Reconnect failed");
    });

    // Add message listener
    newSocket.on("message", (message) => {
      console.log("Message Received");
      // Add message to list of previous messages
      //setMessages((prevMessages) => [...prevMessages, message]);
      console.log(message);
    });
    // Register the user with their user ID
    const registerUser = (userId) => {
      newSocket.emit("register", userId);
    };

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    console.log("Sending Message");
    if (socket) {
      // Send message to server
      const messageObj = {
        content: message,
        userId: currentUser.id, // Include the test user ID here
        endUserID: reciepientUser.id,
      };

      // Send message to server
      socket.emit("message", messageObj);
      // Reset message input
      setMessage("");
    }
  };

  return (
    <div>
      <div>
        {/* Display previous messages */}
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      {/* Input field for new message */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {/* Button to send message */}
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
