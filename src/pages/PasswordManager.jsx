import React, { useState } from "react";
import "../styles/PasswordManager.css";
import NavBar from "../components/NavBar";

const PasswordManager = () => {
  return (
    <>
      <NavBar />
      <div className="signup-container">
        <h2>This is Password Manager Page</h2>
      </div>
    </>
  );
};

export default PasswordManager;
