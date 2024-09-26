import React from "react";
import { userStore } from "../../UserStore";
import { useNavigate } from "react-router-dom";
import "./UsersListItem.css";

const UsersListItem = ({ user, key }) => {
  //console.log(user);
  const navigate = useNavigate();
  const setUser = (event) => {
    // Get the user from the button
    const userName = event.target.innerText;
    // Get the id from the user object
    const users = userStore.getAllUsers();
    // Search an array of maps
    const user = users.find((u) => u.username === userName);
    if (user) {
      userStore.setReciepientUser(user);
      navigate("/chat");
    }
  };
  return (
    <div>
      <button className="userListItem__button" onClick={setUser}>
        <div className="userListItem__header">
          <h2>{user.username}</h2>
          <span
            className={`status-dot ${user.online ? "online" : "offline"}`}
          ></span>
        </div>

        {<p>{user.message === "No message found" ? "" : user.message}</p>}
      </button>
    </div>
  );
};

export default UsersListItem;
