import { useState, useContext, useEffect } from "react";
import "../styles/PasswordManager.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { mainContext } from "../context/mainContextProvider";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaEye, FaEyeSlash, FaCopy } from "react-icons/fa";
import { PiPasswordFill } from "react-icons/pi";
import { InputGroup, Modal } from "react-bootstrap";
import { FaInternetExplorer } from "react-icons/fa6";
import ToggleButton from "react-bootstrap/ToggleButton";
import Alert from "react-bootstrap/Alert";
import { FaRegCircleUser } from "react-icons/fa6";
import crypto from "crypto";

const PasswordManager = () => {
  const [show, setShow] = useState(false);
  const { contextValue } = useContext(mainContext);
  const setUser = contextValue.setUser;
  const user = contextValue.user;
  const searchValue = contextValue.searchValue;
  const setIsLoggedIn = contextValue.setIsLoggedIn;
  const [site, setSite] = useState("");
  const navigate = useNavigate();
  const [alertMsg, setAlertMsg] = useState("");
  const [isShowMsg, setIsShowMsg] = useState(false);
  const [msgType, setMsgType] = useState("danger");
  const [passwordsList, setPasswordsList] = useState([]);
  const [alphabetChecked, setAlphabetChecked] = useState(false);
  const [numChecked, setNumChecked] = useState(false);
  const [symbolsChecked, setSymbolsChecked] = useState(false);
  const [length, setLength] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [addOrEdit, setAddOrEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [isShowDelete, setIsShowDelete] = useState(false);
  const [isShowShare, setIsShowShare] = useState(false);
  const [recipientUser, setRecipientUser] = useState("");
  const [sharePassword, setSharePassword] = useState("");
  const [shareSite, setShareSite] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const setNavBarActive = contextValue.setNavBarActive;
  setNavBarActive("Passwords");

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
      setOriginalData([...response.data]);
    } catch (e) {
      setAlertMsg(e.response.data);
      setMessages("danger");
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
      setAlertMsg("Please select at least one character type.");
      setMessages("danger");
      return;
    }
    if (!length) {
      setAlertMsg("Please input the length of the password.");
      setMessages("danger");
      return;
    }

    if (length < 4 || length > 50) {
      setAlertMsg("Password length should be between 6 and 20 characters.");
      setMessages("danger");

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

    // generateRandomPassword(length);
    setPassword(password);
    setAlertMsg("Password generated successfully.");
    setMessages("success");
  };

  const handleModalSubmit = async () => {
    if (!site || !password) {
      setAlertMsg("Please fill in all fields.");
      setMessages("danger");
      return;
    }

    if (addOrEdit) {
      if (!editId) {
        setAlertMsg("No password to edit.");
        setMessages("danger");
        return;
      }

      const isChanged = passwordsList.find(
        (item) =>
          item._id === editId &&
          item.site === site &&
          item.password === password
      );

      if (isChanged) {
        setAlertMsg("No changes to save.");
        setMessages("danger");
        return;
      }
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
      console.log(response.data);
      setPasswordsList([...passwordsList, response.data]);
      setAlertMsg("Password added successfully.");
      setMessages("success");
      handleClose();
    } catch (e) {
      setAlertMsg(e.response.data);
      setMessages("danger");
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

      setAlertMsg("Password updated successfully.");
      setMessages("success");
      handleClose();
    } catch (e) {
      setAlertMsg(e.response.data);
      setMessages("danger");
      console.log(e);
    }
  };
  const handleConfirmDelete = async () => {
    try {
      await axios.delete("/api/passwords/" + deleteId);
      const updatedPasswordsList = passwordsList.filter(
        (password) => password._id !== deleteId
      );
      setPasswordsList(updatedPasswordsList);
      setAlertMsg("Password deleted successfully.");
      setMessages("success");
      handleDeleteClose();
    } catch (e) {
      setAlertMsg(e.response.data);
      setMessages("danger");
      console.log(e);
    }
  };
  const handleDeleteClose = () => {
    setDeleteId("");
    setIsShowDelete(false);
  };
  const handleDeletePassword = (id) => {
    setDeleteId(id);
    setIsShowDelete(true);
  };
  const handlShareClose = () => {
    setRecipientUser("");
    setIsShowShare(false);
  };

  const handleConfirmShare = async () => {
    if (!recipientUser) {
      setAlertMsg("Please fill in the recipient user.");
      setMessages("danger");
      return;
    }
    if (!sharePassword) {
      setAlertMsg("No password to share.");
      setMessages("danger");
      return;
    }
    if (!shareSite) {
      setAlertMsg("No site to share.");
      setMessages("danger");
      return;
    }
    if (recipientUser === user) {
      setAlertMsg("You cannot share password with yourself.");
      setMessages("danger");
      return;
    }

    try {
      await axios.post("/api/share", {
        recipientUser: recipientUser,
        sharedPassword: sharePassword,
        sharedSite: shareSite,
      });
      setAlertMsg("Password shared successfully.");
      setMessages("success");
      handlShareClose();
    } catch (e) {
      setAlertMsg(e.response.data);
      setMessages("danger");
    }
  };

  const handleSharePassword = (site, password) => {
    setSharePassword(password);
    setShareSite(site);
    setIsShowShare(true);
  };

  const searchFilter = (passwordsList) => {
    if (searchValue === "") {
      return passwordsList;
    }
    return passwordsList.filter((password) =>
      password.site.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  function onStart() {
    isLoggedIn().then(() => {
      getPasswords();
    });
  }

  useEffect(onStart, []);

  useEffect(() => {
    const filteredList = searchFilter(originalData);
    setPasswordsList(filteredList);
  }, [searchValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShowMsg(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isShowMsg]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(password);
    setAlertMsg("Password copied to clipboard.");
    setMessages("success");
  };
  const setMessages = (type) => {
    setMsgType(type);
    setIsShowMsg(true);
  };

  //Cryptographically Secure Passwords
  function generateRandomPassword(length) {
    // Determine the number of bytes needed for the desired length
    const bytesNeeded = Math.ceil(length * 0.75); // Base64 uses 6 bits per character (0.75 bytes per character)

    // Generate random bytes
    const randomBytes = crypto.randomBytes(bytesNeeded);

    // Convert random bytes to a base64 string
    const password = randomBytes
      .toString("base64")
      // Remove special characters from base64 encoding
      .replace(/[+/=]/g, "")
      // Ensure the password is the desired length
      .slice(0, length);

    return password;
  }

  const passwordsListElements = [];
  passwordsList.map((password, index) => {
    passwordsListElements.push(
      <div className="col-div" key={index}>
        <a className="col-icon">
          <RiLockPasswordLine />
        </a>
        <a className="col-site">{password.site}</a>
        <div className="col-psw-size">
          <Button
            className="col-button"
            variant="info"
            onClick={() =>
              handleSharePassword(password.site, password.password)
            }
          >
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
      </div>
    );
  });

  return (
    <>
      {/* <NavBar /> */}
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

      <div className="top-container">
        <div>
          <h3>Passwords</h3>
        </div>
        <div>
          <p>
            Create, save, and manage your passwords so you can easily sign in to
            sites and apps.
          </p>
        </div>
      </div>
      <div className="main-container">
        <div className="main-header">
          <Button
            className="add-btn"
            variant="primary"
            onClick={handleAddPassword}
          >
            Create
          </Button>
        </div>
        <div className="main-body">{passwordsListElements}</div>
      </div>
      <>
        <Modal show={show} onHide={handleClose} centered backdrop="static">
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
        <Modal
          show={isShowDelete}
          onHide={handleDeleteClose}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this password?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleDeleteClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={isShowShare}
          onHide={handlShareClose}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Share </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Label>Recipient User</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text>
                <FaRegCircleUser />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Share with a user"
                value={recipientUser}
                onChange={(e) => setRecipientUser(e.target.value)}
                autoFocus
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handlShareClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmShare}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </>
  );
};

export default PasswordManager;
