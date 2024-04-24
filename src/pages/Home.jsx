import "../styles/Home.css";
import passwordGif from "../assets/img/Password-Vault.gif";
import { LinearGradient } from "react-text-gradients";
import NavBar from "../components/NavBar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  async function isLoggedIn() {
    try {
      const response = await axios.get("/api/users/loggedIn");
      // const username = response.data.username;
    } catch (e) {
      navigate("/");
    }
  }

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="textContainer">
          <h1>
            <LinearGradient gradient={["to left", "#17acff ,#ff68f0"]}>
              Fewer Passwords, Less Friction.
            </LinearGradient>
          </h1>
          <p>
            Introducing our revolutionary Password Manager App! Say goodbye to
            the hassle of remembering multiple passwords and welcome a seamless
            and secure password management experience. Our app provides a
            centralized platform to store, organize, and generate strong
            passwords for all your accounts, ensuring maximum security without
            compromising convenience 🚀
          </p>
          <br />
          <div className="link">
            <p>
              Created by:{" "}
              <strong>
                <a
                  href="https://github.com/JeremyKaku"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Jing Guo
                </a>
              </strong>{" "}
              and{" "}
              <strong>
                <a
                  href="https://github.com/YukiXueHan"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Xue Han
                </a>
              </strong>
            </p>
          </div>
        </div>
        <div className="gifContainer">
          <img src={passwordGif} alt="GIF" className="gif" />
        </div>
      </div>
    </>
  );
}
