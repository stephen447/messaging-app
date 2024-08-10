import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { userStore } from "../../UserStore";
import axios from "axios";
import "./Chat.css";

const Chat = () => {
  // State variables for the message input and messages
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  // Get the current user and the recipient user from the user store
  const currentUser = userStore.getCurrentUser;
  const recipientUser = userStore.getReciepientUser;

  // Fetch messages and online users
  useEffect(() => {
    axios
      .get("http://localhost:5001/message/v1/getMessage", {
        params: {
          userId: currentUser.id,
          endUserId: recipientUser.id,
        },
      })
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get("http://localhost:5001/users/v1/online-users")
      .then((response) => {
        setOnlineUsers(response.data);
      });
  }, [currentUser.id, recipientUser.id]);

  // Handle socket connections and events
  useEffect(() => {
    const newSocket = io("http://localhost:5001", {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      registerUser(currentUser.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    newSocket.on("userStatus", (data) => {
      console.log(`User ${data.userId} is ${data.status}`);

      setOnlineUsers((prevUsers) => {
        if (data.status === "online") {
          if (!prevUsers.includes(data.userId)) {
            const updatedUsers = [...prevUsers, data.userId];
            return updatedUsers;
          }
        } else if (data.status === "offline") {
          let updatedU = onlineUsers;
          updatedU = updatedU.filter((userId) => userId !== data.userId);
          return updatedU;
        }
        return prevUsers;
      });
    });

    newSocket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    const registerUser = (userId) => {
      newSocket.emit("register", userId);
    };

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser.id]);

  const sendMessage = () => {
    if (socket) {
      const messageObj = {
        content: message,
        userId: currentUser.id,
        endUserID: recipientUser.id,
      };
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message,
          fromUserId: currentUser.id,
          endUserID: recipientUser.id,
        },
      ]);
      socket.emit("message", messageObj);
      setMessage("");
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.fromUserId === currentUser.id ? "from-me" : "from-them"
            }`}
          >
            {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
