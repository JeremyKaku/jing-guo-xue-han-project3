import React, { useState, useContext } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/Signup.css";
import NavBar from "../components/NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { mainContext } from "../context/mainContextProvider";

const Signup = () => {
  // const history = useHistory();
  const { contextValue } = useContext(mainContext);
  const navigate = useNavigate();
  const [usernameState, setUsernameState] = useState("");
  const [passwordState, setPasswordState] = useState("");
  const [confirmPasswordState, setConfirmPasswordState] = useState("");
  const [errorMsgState, setErrorMsgState] = useState("");
  const setIsLoggedIn = contextValue.setIsLoggedIn;
  const setUser = contextValue.setUser;

  const handleLogin = (e) => {
    e.preventDefault();
    setUsernameState("");
    setPasswordState("");
    setConfirmPasswordState("");
  };

  async function handleSignup(e) {
    e.preventDefault();
    if (passwordState !== confirmPasswordState) {
      setErrorMsgState("Passwords do not match!");
      return;
    }
    const newUser = {
      username: usernameState,
      password: passwordState,
    };
    try {
      await axios.post("/api/users/register", newUser);
      setIsLoggedIn(true);
      setUser(usernameState);
      navigate("/passwordmanager");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <NavBar />
      <div className="signup-container">
        <h2>Sign up</h2>
        <form onSubmit={handleLogin}>
          <label className="input-box">
            <input
              type="text"
              placeholder="Username"
              value={usernameState}
              onChange={(e) => setUsernameState(e.target.value)}
              required
            />
            <FaUser className="icon" />
          </label>
          <br />
          <label className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={passwordState}
              onChange={(e) => setPasswordState(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </label>
          <br />
          <label className="input-box">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPasswordState}
              onChange={(e) => setConfirmPasswordState(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </label>
          <br />
          <button type="submit" onClick={handleSignup}>
            Register
          </button>
          <br />
          <div className="register-link">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Signup;
