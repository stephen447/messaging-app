import React, { useEffect, useState } from "react";
import axios from "axios";
import { userStore } from "../../UserStore";
import UsersListItem from "../UsersListItem/UsersListItem";
import { observer } from "mobx-react-lite";
import socketService from "../../socketService";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Loader from "../Loader/Loader";
import "./Users.css";

const Users = observer(() => {
  // State variables
  const [users, setUsers] = useState([]); // List of users
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const user = userStore.getCurrentUser; // Get the current user

  // Function to update the online status of a specific user
  const updateOnlineStatus = (userId, newStatus) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.userId === userId ? { ...user, online: newStatus } : user
      )
    );
  };

  // Fetch last messages between the current user and all other users
  useEffect(() => {
    const getLastMessages = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/message/v1/getLastMessage?userId=${user.id}`
        );
        setUsers(response.data);
      } catch (err) {
        setError(err);
        console.error("Failed to fetch last messages", err);
      } finally {
        setLoading(false);
      }
    };
    getLastMessages();
  }, [user.id]);

  // Fetch online users and update their status
  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/v1/online-users`
        );
        const onlineUsers = await Promise.all(
          response.data.map(async (userId) => {
            const userResponse = await axios.get(
              `${process.env.REACT_APP_API_URL}/user/v1/getUserById/${userId}`
            );
            return userResponse.data;
          })
        );

        onlineUsers.forEach((onlineUser) => {
          const foundUser = users.find(
            (u) => u.username === onlineUser.username
          );
          if (foundUser) {
            updateOnlineStatus(foundUser.userId, true);
          }
        });

        //userStore.setOnlineUsers(users);
      } catch (err) {
        console.error("Failed to fetch online users", err);
      }
    };
    fetchOnlineUsers();
  }, [users]);

  // Handle socket events for user status changes
  useEffect(() => {
    const handleUserStatus = async (data) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/v1/getUserById/${data.userId}`
        );
        updateOnlineStatus(response.data.userId, data.status);
      } catch (err) {
        console.error("Error fetching user status", err);
      }
    };

    socketService.socket.on("userStatus", handleUserStatus);

    return () => {
      socketService.socket.off("userStatus", handleUserStatus);
    };
  }, []);

  return (
    <div>
      <Header />
      {loading ? (
        <Loader />
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <div className="users__container">
          <div style={{ width: "100%" }}>
            <h2 className="primary-text">Users</h2>
            {users.map((user) => (
              <UsersListItem key={user.userId} user={user} />
            ))}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
});

export default Users;
