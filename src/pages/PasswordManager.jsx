import React, { useState } from 'react';
import '../styles/PasswordManager.css';
import PasswordNavBar from '../components/PasswordNavBar';

const PasswordManager = () => {

  return (
    <>
      <PasswordNavBar />
      <div className="signup-container">
        <h2>This is Password Manager Page</h2>
      </div>
    </>
  );
};

export default PasswordManager;
