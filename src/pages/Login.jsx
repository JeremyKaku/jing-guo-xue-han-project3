import { useState, useContext, useEffect } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/Login.css";
import catLogo from "../assets/img/cat.gif";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { mainContext } from "../context/mainContextProvider";
import { Alert } from "react-bootstrap";

const Login = () => {
  const { contextValue } = useContext(mainContext);
  const setIsLoggedIn = contextValue.setIsLoggedIn;
  const setUser = contextValue.setUser;
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isShowMsg, setIsShowMsg] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const setNavBarActive = contextValue.setNavBarActive;
  setNavBarActive("Login");

  async function submit(e) {
    e.preventDefault();

    if (!username || !password) {
      setIsShowMsg(true);
      setAlertMsg("Please fill in all the fields!");
      setMsgType("danger");
      return;
    }

    try {
      await axios.post("/api/users/login", {
        username: username,
        password: password,
      });
      setIsLoggedIn(true);
      setUser(username);
      navigate("/passwordmanager");
    } catch (e) {
      setIsShowMsg(true);
      setAlertMsg(e.response.data);
      setMsgType("danger");
      console.log(e);
    }
  }

  const handleLogin = (e) => {
    e.preventDefault();
    setUsername("");
    setPassword("");
  };

  useEffect(() => {
    if (isShowMsg) {
      setTimeout(() => {
        setIsShowMsg(false);
      }, 3000);
    }
  }, [isShowMsg]);

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
