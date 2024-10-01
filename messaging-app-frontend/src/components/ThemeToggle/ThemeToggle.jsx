import React, { useState, useEffect } from "react";
import "../../App.css";

const ThemeToggle = () => {
  // Get the theme from the local storage
  let localTheme = localStorage.getItem("theme");
  if (!localTheme) {
    // Set the theme to light if no theme is found in local storage
    localStorage.setItem("theme", "light");
    localTheme = "light";
  }

  const [theme, setTheme] = useState(localTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <>
      <button onClick={toggleTheme} className="header__button">
        <h2>{theme === "light" ? "Dark" : "Light"} Mode</h2>
      </button>
    </>
  );
};

export default ThemeToggle;
