import React, { useEffect, useState } from "react";
import axios from "axios";
import { userStore } from "../../UserStore";
import "./Chat.css";
import Message from "../Message/Message";
import socketService from "../../socketService";
import Header from "../Header/Header";

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
      .get(process.env.REACT_APP_API_URL + "/message/v1/getMessage", {
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
      <Header />
      <h1 className="primary-text chat__heading">{recipientUser.username}</h1>
      <div className="chat-messages__container">
        {messages.map((message, index) => (
          <Message
            key={index}
            message={message}
            reciepient={
              message.fromUserId === userStore.getCurrentUser.id ? false : true
            }
          />
        ))}
      </div>
      <div className="chat-input__container">
        <input
          type="text"
          className="input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="send__button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </>
  );
};

export default Chat;
