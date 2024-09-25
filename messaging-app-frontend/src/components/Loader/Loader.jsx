// src/components/Loader.js
import React from "react";
import "./Loader.css"; // Import the CSS file for styling

const Loader = () => {
  return (
    <div className="loader">
      <p>Loading</p>
      <div className="loader__circle"></div>
      <div className="loader__circle"></div>
      <div className="loader__circle"></div>
    </div>
  );
};

export default Loader;
