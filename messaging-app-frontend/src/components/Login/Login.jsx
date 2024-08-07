import React, { useEffect, useState } from "react";
import axios from "axios";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../UserStore";
const Login = observer(() => {
  // Send API request to get a list of users
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Define the function to fetch users
    const fetchUsers = async () => {
      try {
        // Make a GET request to the backend API
        const response = await axios.get(
          "http://localhost:5001/user/v1/getAllUsers"
        );
        // Update the state with the fetched users
        setUsers(response.data);
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
      userStore.setCurrentUser(user);
      navigate("/users");
    }
  };

  return (
    <div>
      <h1>Login</h1>
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
});
export default Login;
