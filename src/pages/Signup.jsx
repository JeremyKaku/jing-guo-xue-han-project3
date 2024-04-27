import { useState, useContext, useEffect } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/Signup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { mainContext } from "../context/mainContextProvider";
import { Alert } from "react-bootstrap";

const Signup = () => {
  const { contextValue } = useContext(mainContext);
  const navigate = useNavigate();
  const [usernameState, setUsernameState] = useState("");
  const [passwordState, setPasswordState] = useState("");
  const [confirmPasswordState, setConfirmPasswordState] = useState("");
  const setIsLoggedIn = contextValue.setIsLoggedIn;
  const setUser = contextValue.setUser;
  const [isShowMsg, setIsShowMsg] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const setNavBarActive = contextValue.setNavBarActive;
  setNavBarActive("Signup");

  const handleLogin = (e) => {
    e.preventDefault();
    setUsernameState("");
    setPasswordState("");
    setConfirmPasswordState("");
  };

  async function handleSignup(e) {
    e.preventDefault();

    if (!usernameState || !passwordState || !confirmPasswordState) {
      setIsShowMsg(true);
      setAlertMsg("Please fill in all the fields!");
      setMsgType("danger");
      return;
    }

    if (passwordState !== confirmPasswordState) {
      setIsShowMsg(true);
      setAlertMsg("Two passwords do not match!");
      setMsgType("danger");
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
      setIsShowMsg(true);
      setAlertMsg(error.response.data);
      setMsgType("danger");

      console.error(error);
    }
  }

  useEffect(() => {
    if (isShowMsg) {
      setTimeout(() => {
        setIsShowMsg(false);
      }, 3000);
    }
  });

  return (
    <>
      <Alert
        className="my-alert"
        key={msgType}
        variant={msgType}
        show={isShowMsg}
        onClose={() => setIsShowMsg(false)}
        dismissible
      >
        {alertMsg}
      </Alert>
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
