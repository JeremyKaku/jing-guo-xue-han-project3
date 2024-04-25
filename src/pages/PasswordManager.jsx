import React, { useState, useContext, useEffect } from "react";
import "../styles/PasswordManager.css";
import NavBar from "../components/NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { mainContext } from "../context/mainContextProvider";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaEdit, FaTrash, FaEye, FaEyeSlash, FaCopy } from "react-icons/fa";
import { PiPasswordFill } from "react-icons/pi";
// import Modal from "react-bootstrap/Modal";
import { InputGroup, Modal } from "react-bootstrap";
import { FaInternetExplorer } from "react-icons/fa6";
import ToggleButton from "react-bootstrap/ToggleButton";
import InputGroupText from "react-bootstrap/esm/InputGroupText";

const PasswordManager = () => {
  const [show, setShow] = useState(false);
  const { contextValue } = useContext(mainContext);
  const setUser = contextValue.setUser;
  const user = contextValue.user;
  const setIsLoggedIn = contextValue.setIsLoggedIn;

  const [site, setSite] = useState("");
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [passwordsList, setPasswordsList] = useState([]);
  const [alphabetChecked, setAlphabetChecked] = useState(false);
  const [numChecked, setNumChecked] = useState(false);
  const [symbolsChecked, setSymbolsChecked] = useState(false);
  const [length, setLength] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [addOrEdit, setAddOrEdit] = useState(false);
  const [editId, setEditId] = useState("");

  async function isLoggedIn() {
    try {
      const response = await axios.get("/api/users/loggedIn");
      const username = response.data.username;
      setUser(username);
      setIsLoggedIn(true);
    } catch (e) {
      navigate("/");
    }
  }

  async function getPasswords() {
    try {
      const response = await axios.get("/api/passwords");
      setPasswordsList(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  const handleClose = () => {
    setEditId("");
    setSite("");
    setPassword("");
    setLength("");
    setAlphabetChecked(false);
    setNumChecked(false);
    setSymbolsChecked(false);
    setErrorMsg("");
    setShow(false);
    setAddOrEdit(false);
  };
  const handleShow = (passwordInfo) => {
    if (passwordInfo) {
      setEditId(passwordInfo.id);
      setSite(passwordInfo.site);
      setPassword(passwordInfo.password);
      setAddOrEdit(true);
    }
    setShow(true);
  };

  const handleAddPassword = () => {
    handleShow();
  };

  const handleEditPassword = (id, site, psw) => {
    const passwordInfo = { id: id, site: site, password: psw };
    handleShow(passwordInfo);
  };

  const handleLengthChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, "").replace(/^0+/, "");
    if (value.length > 2) {
      value = value.slice(0, 2);
    }
    setLength(value);
  };

  const handleGeneratePassword = () => {
    if (!alphabetChecked && !numChecked && !symbolsChecked) {
      setErrorMsg("Please select at least one character type");
      return;
    }
    if (!length) {
      setErrorMsg("Please input the length of the password");
      return;
    }

    if (length < 4 || length > 50) {
      setErrorMsg("Password length should be between 6 and 20 characters");
      return;
    }
    let password = "";
    let characters = "";
    if (alphabetChecked) {
      characters += "abcdefghijklmnopqrstuvwxyz";
    }
    if (numChecked) {
      characters += "0123456789";
    }
    if (symbolsChecked) {
      characters += "!@#$%^&*()_+";
    }
    for (let i = 0; i < length; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setPassword(password);
  };

  const handleModalSubmit = async () => {
    if (!site || !password) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    if (addOrEdit) {
      if (!editId) {
        setErrorMsg("No password to edit");
        return;
      }
      passwordsList.map((item) => {
        if (
          item._id === editId &&
          item.site === site &&
          item.password === password
        ) {
          setErrorMsg("No changes to save");
          return;
        }
      });
      await editPassword();
    } else {
      await addPassword();
    }
  };

  const addPassword = async () => {
    try {
      const response = await axios.post("/api/passwords", {
        site: site,
        password: password,
      });
      setPasswordsList([...passwordsList, response.data]);
      handleClose();
    } catch (e) {
      setErrorMsg(e.response.data);
    }
  };

  const editPassword = async () => {
    try {
      const response = await axios.put("/api/passwords/" + editId, {
        site: site,
        password: password,
      });
      const updatedPasswordsList = passwordsList.map((item) => {
        if (item._id === editId) {
          item.site = site;
          item.password = password;
        }
        return item;
      });
      setPasswordsList(updatedPasswordsList);
      handleClose();
    } catch (e) {
      console.log(e);
      setErrorMsg();
    }
  };

  const handleDeletePassword = async (id) => {
    try {
      await axios.delete("/api/passwords/" + id);
      const updatedPasswordsList = passwordsList.filter(
        (password) => password._id !== id
      );
      setPasswordsList(updatedPasswordsList);
    } catch (e) {
      console.log(e);
    }
  };

  function onStart() {
    isLoggedIn().then(() => {
      getPasswords();
    });
  }

  useEffect(onStart, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(password);
  };

  const passwordsListElements = [];
  passwordsList.map((password, index) => {
    passwordsListElements.push(
      <div className="col-div" key={index}>
        <RiLockPasswordLine className="col-icon" />
        <a className="col-site">{password.site}</a>
        <Button className="col-button" variant="info">
          Share
        </Button>
        <Button
          className="col-button"
          variant="success"
          onClick={() =>
            handleEditPassword(password._id, password.site, password.password)
          }
        >
          Edit
        </Button>
        <Button
          className="col-button"
          variant="danger"
          onClick={() => handleDeletePassword(password._id)}
        >
          Delete
        </Button>
      </div>
    );
  });

  return (
    <>
      <NavBar />
      <div className="pswmanager-container">
        <div className="top-container">
          <h3>Passwords</h3>
          <Button variant="primary" onClick={handleAddPassword}>
            Add
          </Button>
        </div>
        {passwordsListElements}

        {/* <p>
          Create, save, and manage your passwords so you can easily sign in to
          sites and apps.
        </p> */}
      </div>
      <>
        <Modal
          // className="add-edit-modal"
          // dialogClassName="add-edit-modal"
          show={show}
          onHide={handleClose}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{addOrEdit ? "Edit" : "Add"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Label>Site</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text>
                <FaInternetExplorer />
              </InputGroup.Text>
              <Form.Control
                type="url"
                placeholder="URL or name of the site"
                value={site}
                onChange={(e) => setSite(e.target.value)}
                autoFocus
              />
            </InputGroup>

            <Form.Label>Password</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text>
                <PiPasswordFill />
              </InputGroup.Text>
              <Form.Control
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Input the password or generate one"
              />
              <InputGroup.Text>
                <button
                  className="input-icon"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </InputGroup.Text>
              <InputGroup.Text>
                <button
                  className="input-icon"
                  onClick={copyPasswordToClipboard}
                >
                  <FaCopy />
                </button>
              </InputGroup.Text>
            </InputGroup>

            <Form.Label>Generate Password</Form.Label>
            <InputGroup className="mb-3">
              <ToggleButton
                className="mb-2"
                id="toggle-check1"
                type="checkbox"
                variant="outline-primary"
                checked={alphabetChecked}
                value="1"
                onChange={(e) => setAlphabetChecked(e.currentTarget.checked)}
              >
                Alphabet
              </ToggleButton>
              <ToggleButton
                className="mb-2"
                id="toggle-check2"
                type="checkbox"
                variant="outline-primary"
                checked={numChecked}
                value="1"
                onChange={(e) => setNumChecked(e.currentTarget.checked)}
              >
                Numerals
              </ToggleButton>
              <ToggleButton
                className="mb-2"
                id="toggle-check3"
                type="checkbox"
                variant="outline-primary"
                checked={symbolsChecked}
                value="1"
                onChange={(e) => setSymbolsChecked(e.currentTarget.checked)}
              >
                Symbols
              </ToggleButton>
              <Form.Control
                className="mb-2"
                type="text"
                placeholder="Length"
                value={length}
                maxLength={2}
                onChange={(e) => handleLengthChange(e)}
              />
              <Button
                className="mb-2"
                variant="warning"
                onClick={handleGeneratePassword}
              >
                Generate
              </Button>
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button tpye="submit" variant="primary" onClick={handleModalSubmit}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </>
  );
};

export default PasswordManager;
