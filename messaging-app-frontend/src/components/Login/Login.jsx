import React, { useEffect, useState } from "react";
import axios from "axios";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../UserStore";
import socketService from "../../socketService";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./Login.css";
import Loader from "../Loader/Loader";
import WarningPopUp from "../WarningPopUp/WarningPopUp";
const Login = observer(() => {
  // Send API request to get a list of users
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);

  // Show popup on first page load
  useEffect(() => {
    setShowPopup(true);
  }, []);

  // Function to close the popup
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    // Define the function to fetch users
    const fetchUsers = async () => {
      try {
        // Make a GET request to the backend API
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/user/v1/getAllUsers"
        );
        // Save the users in the datastore
        userStore.setAllUsers(response.data);
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
    console.log("setting user");
    // Get the user from the button
    const userName = event.target.value;
    console.log(userName);
    // Get the id from the user object
    const user = users.find((u) => u.username === userName);
    if (user) {
      userStore.setCurrentUser(user);
      socketService.socket.emit("register", user.id);
      navigate("/users");
    }
  };

  return (
    <div className="login__container">
      <Header />
      {/*List of buttons to select a user*/}
      {loading ? (
        <>
          <Loader />
          {showPopup && <WarningPopUp handleClose={handleClosePopup} />}
        </>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <>
          <div className="login__container--inputs container">
            <h1 className="primary-text">Login</h1>
            <label className="primary-text" htmlFor="user-select">
              Choose a user to login
            </label>
            <select
              id="user-select"
              className="primary__select"
              onChange={setUser}
            >
              <option value="">--Please choose a user--</option>
              {users.map((user) => (
                <option key={user.id} value={user.username}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
});
export default Login;
