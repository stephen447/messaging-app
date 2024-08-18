import React from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const Header = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <header className="header__container">
      <button className="header__button" onClick={goHome}>
        Home
      </button>
      <ThemeToggle />
    </header>
  );
};

export default Header;
