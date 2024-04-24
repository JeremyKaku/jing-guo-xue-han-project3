import React, { useState, useContext } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/Login.css";
import catLogo from "../assets/img/cat.gif";
import NavBar from "../components/NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { mainContext } from "../context/mainContextProvider";

const Login = () => {
  const { contextValue } = useContext(mainContext);
  const setIsLoggedIn = contextValue.setIsLoggedIn;
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      await axios.post("/api/users/login", {
        username: username,
        password: password,
      });
      setIsLoggedIn(true);
      navigate("/passwordmanager");
    } catch (e) {
      console.log(e);
    }
  }

  const handleLogin = (e) => {
    e.preventDefault();
    setUsername("");
    setPassword("");
  };

  return (
    <>
      <NavBar />
      <div className="cat-container">
        <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <label className="input-box">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <FaUser className="icon" />
            </label>
            <br />
            <label className="input-box">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FaLock className="icon" />
            </label>
            <br />
            <button type="submit" onClick={submit}>
              Login
            </button>
            <br />
            <div className="register-link">
              <p>
                Don&apos;t have an account? <Link to="/signup">Register</Link>
              </p>
            </div>
          </form>
        </div>
        <img src={catLogo} alt="Cat Logo" className="cat-logo" />
      </div>
    </>
  );
};

export default Login;
