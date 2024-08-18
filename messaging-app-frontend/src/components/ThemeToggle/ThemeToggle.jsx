import React, { useState, useEffect } from "react";
import "../../App.css";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <>
      <button onClick={toggleTheme} className="header__button">
        {theme === "light" ? "Dark" : "Light"} Mode
      </button>
    </>
  );
};

export default ThemeToggle;
