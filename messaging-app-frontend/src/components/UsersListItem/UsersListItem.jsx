import React from "react";
import { userStore } from "../../UserStore";
import { useNavigate } from "react-router-dom";
const UsersListItem = ({ user, online }) => {
  console.log("USER TEST", user);
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
      <button className="user__button" onClick={setUser}>
        {user.username}
      </button>
    </div>
  );
};

export default UsersListItem;
