import React, { useState } from 'react';
import { FaUser, FaLock } from "react-icons/fa";
import { Link } from 'react-router-dom';
import '../styles/Signup.css';
import NavBar from '../components/NavBar';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <>
      <NavBar />
      <div className="signup-container">
        <h2>Sign up</h2>
        <form onSubmit={handleLogin}>
          <label className='input-box'>
            <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} required />
            <FaUser className='icon' />
          </label>
          <br />
          <label className='input-box'>
            <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
            <FaLock className='icon' />
          </label><br />
          <label className='input-box'>
            <input type="password" placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <FaLock className='icon' />
          </label>
          <br />
          <button type="submit">Login</button><br />
          <div className='register-link'>
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Signup;
