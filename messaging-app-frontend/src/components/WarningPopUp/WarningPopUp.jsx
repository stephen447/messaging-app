// src/components/Popup.js
import React from "react";
import "./WarningPopUp.css"; // Import your CSS for the popup

const Popup = ({ handleClose }) => {
  return (
    <div className="popup">
      <div className="popup__content">
        <h2>Welcome!</h2>
        <p>
          The page can take up to 50 seconds to load, due to the API server
          spinning down due to inactivity
        </p>
        <button onClick={handleClose} className="popup__close-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;
