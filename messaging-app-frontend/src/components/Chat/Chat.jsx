import React, { useEffect, useState } from "react";
import axios from "axios";
import { userStore } from "../../UserStore";
import "./Chat.css";
import Message from "../Message/Message";
import socketService from "../../socketService";

const Chat = () => {
  // State vairables
  const [message, setMessage] = useState(""); // The message to be sent
  const [messages, setMessages] = useState([]); // The list of messages in the chat
  const [socket, setSocket] = useState(null); // The socket instance

  const currentUser = userStore.getCurrentUser;
  const recipientUser = userStore.getReciepientUser;

  useEffect(() => {
    // Initialize the socket only once when the component mounts
    const socketInstance = socketService.socket;
    setSocket(socketInstance);

    // Fetch messages for the current conversation
    axios
      .get("http://localhost:5001/message/v1/getMessage", {
        params: {
          userId: currentUser.id,
          endUserId: recipientUser.id,
        },
      })
      .then((response) => {
        // set the messages in the state
        setMessages(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Handle socket events for when a message is sent to the user
    socketInstance.on("message", (message) => {
      // Add it to the list of messages
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, [currentUser.id, recipientUser.id]); // Dependency array to ensure useEffect only runs when these IDs change

  // Function to send a message
  const sendMessage = () => {
    // Check if the socket exists and the message is not empty
    if (socket && message.trim() !== "") {
      // Create a message object
      const messageObj = {
        content: message,
        userId: currentUser.id,
        endUserID: recipientUser.id,
      };
      // Add the message to the list of messages
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message,
          fromUserId: currentUser.id,
          endUserID: recipientUser.id,
        },
      ]);
      // Emit the message to the server
      socket.emit("message", messageObj);
      // Clear the message input
      setMessage("");
    }
  };

  return (
    <>
      <h1>{recipientUser.username}</h1>
      {messages.map((message, index) => (
        <Message
          key={index}
          message={message}
          reciepient={
            message.fromUserId === userStore.getCurrentUser.id ? false : true
          }
        />
      ))}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </>
  );
};

export default Chat;
