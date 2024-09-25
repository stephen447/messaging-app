import React, { useEffect, useState } from "react";
import axios from "axios";
import { userStore } from "../../UserStore";
import { useNavigate } from "react-router-dom";
import UsersListItem from "../UsersListItem/UsersListItem";
import { observer } from "mobx-react-lite";
import socketService from "../../socketService";
import Header from "../Header/Header";
import "./Users.css";
import Footer from "../Footer/Footer";
import Loader from "../Loader/Loader";

const Users = observer(() => {
  // State variables
  const [users, setUsers] = useState([]); // The list of users
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [onlineUsers, setOnlineUsers] = useState([]); // List of online users
  const user = userStore.getCurrentUser; // Get the current user

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Make a GET request to the backend API to get all users
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/user/v1/getAllUsers"
        );
        // Filter out the current user from the list
        const filteredUsers = response.data.filter(
          (u) => u.username !== user.username
        );
        // Update the state with the filtered users
        setUsers(filteredUsers);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user.username]);

  useEffect(() => {
    // Function to fetch online users
    const fetchOnlineUsers = async () => {
      try {
        // Fetches the online userIDs
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/users/v1/online-users"
        );
        // Fetch the user objects for the online users IDs
        const users = await Promise.all(
          response.data.map(async (userId) => {
            const userResponse = await axios.get(
              process.env.REACT_APP_API_URL + "/user/v1/getUserById/" + userId
            );
            return userResponse.data;
          })
        );
        // Update the state with the online users
        setOnlineUsers(users);
        // Update the user store with the online users
        userStore.setOnlineUsers(users);
      } catch (err) {
        console.error("Failed to fetch online users", err);
      }
    };
    fetchOnlineUsers();
  }, []);

  useEffect(() => {
    // Function to handle user status changes
    const handleUserStatus = async (data) => {
      console.log(`User ${data.userId} is ${data.status}`);
      // Get the user object for the user ID
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/user/v1/getUserById/" + data.userId
      );
      const userObj = response.data;
      // Update the online users
      setOnlineUsers((prevUsers) => {
        if (data.status === "online") {
          // Check if the user is already in the list
          if (!prevUsers.some((user) => user.id === userObj.id)) {
            const updatedUsers = [...prevUsers, userObj];
            userStore.setOnlineUsers(updatedUsers);
            return updatedUsers;
          }
        } else if (data.status === "offline") {
          // Remove the user from the list
          const updatedUsers = prevUsers.filter(
            (user) => user.id !== userObj.id
          );
          // Update the user store
          userStore.setOnlineUsers(updatedUsers);
          return updatedUsers;
        }
        return prevUsers;
      });
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
            <h2 className="primary-text">Online</h2>
            {onlineUsers.map((user) => (
              <UsersListItem key={user.id} user={user} online={true} />
            ))}
          </div>
          <div style={{ width: "100%" }}>
            <h2 className="primary-text">Offline</h2>
            {users
              .filter(
                (u) => !onlineUsers.some((onlineUser) => onlineUser.id === u.id)
              )
              .map((user) => (
                <UsersListItem key={user.id} user={user} online={false} />
              ))}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
});

export default Users;
