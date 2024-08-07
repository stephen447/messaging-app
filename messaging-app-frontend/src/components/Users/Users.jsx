import React from "react";
import axios from "axios";
import { userStore } from "../../UserStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Users = () => {
  // Get a list of users from api server and display them using buttons
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get the selected user from the user store
  const user = userStore.getCurrentUser;

  useEffect(() => {
    // Define the function to fetch users
    const fetchUsers = async () => {
      try {
        // Make a GET request to the backend API
        const response = await axios.get(
          "http://localhost:5001/user/v1/getAllUsers"
        );
        // Remove the selected user from the list of users
        const filteredUsers = response.data.filter(
          (u) => u.username !== user.username
        );
        // Update the state with the fetched users
        setUsers(filteredUsers);
      } catch (err) {
        // Handle any errors
        setError(err);
      } finally {
        // Set loading to false
        setLoading(false);
      }
    };
    // Call the function to fetch users
    fetchUsers();
  }, []);

  const setUser = (event) => {
    // Get the user from the button
    const userName = event.target.innerText;
    // Get the id from the user object
    const user = users.find((u) => u.username === userName);
    if (user) {
      userStore.setReciepientUser(user);
      navigate("/chat");
    }
  };

  return (
    <div>
      <h1>Users</h1>
      {/*List of buttons to select a user*/}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <div>
          <p>Select a user:</p>
          {users.map((user) => (
            <button key={user.id} onClick={setUser}>
              {user.username}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
