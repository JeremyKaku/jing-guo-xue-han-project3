import { useState, useContext, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { mainContext } from "../context/mainContextProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RiLockPasswordLine } from "react-icons/ri";
import Button from "react-bootstrap/Button";
import "../styles/SharingCenter.css";
import { Modal, Form, InputGroup } from "react-bootstrap";
import { FaInternetExplorer, FaEye, FaEyeSlash, FaCopy } from "react-icons/fa";
import { PiPasswordFill } from "react-icons/pi";
import { FaRegCircleUser } from "react-icons/fa6";

const SharingCenter = () => {
  const [isShowMsg, setIsShowMsg] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const { contextValue } = useContext(mainContext);
  const setUser = contextValue.setUser;
  const searchValue = contextValue.searchValue;
  const setIsLoggedIn = contextValue.setIsLoggedIn;
  const navigate = useNavigate();
  const [sharePasswordsList, setSharePasswordsList] = useState([]);
  const [show, setShow] = useState(false);
  const [sharingUser, setSharingUser] = useState("");
  const [sharedSite, setSharedSite] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const setNavBarActive = contextValue.setNavBarActive;
  setNavBarActive("Sharing Center");

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

  async function getSharingPasswords() {
    try {
      const response = await axios.get("/api/share");
      setSharePasswordsList(response.data);
      setOriginalData([...response.data]);
    } catch (e) {
      setAlertMsg(e.response.data);
      setMessages("danger");
      console.log(e);
    }
  }

  const handleConfirmSharing = async (id, status) => {
    try {
      const response = await axios.put(`/api/share/${id}`, { status: status });
      setAlertMsg(response.data);
      setMessages("Success confirm the sharing status.");
      getSharingPasswords();
    } catch (e) {
      setAlertMsg(e.response.data);
      setMessages("danger");
      console.log(e);
    }
  };

  function onStart() {
    isLoggedIn().then(() => {
      getSharingPasswords();
    });
  }

  const setMessages = (type) => {
    setMsgType(type);
    setIsShowMsg(true);
  };

  useEffect(onStart, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShowMsg(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isShowMsg]);

  const handleClose = () => setShow(false);

  const handleSharePassword = (share) => {
    setSharingUser(share.sharingUser);
    setSharedSite(share.sharedSite);
    setPassword(share.sharedPassword);
    setShow(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(password);
    setMessages("success");
    setAlertMsg("Password copied to clipboard");
    setIsShowMsg(true);
  };

  const searchFilter = (item) => {
    if (searchValue === "") {
      return item;
    }
    return item.filter(
      (subItem) =>
        subItem.sharedSite.toLowerCase().includes(searchValue.toLowerCase()) ||
        subItem.sharingUser.toLowerCase().includes(searchValue.toLowerCase()) ||
        subItem.status.toLowerCase().includes(searchValue.toLowerCase()) ||
        subItem.sharedPassword.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  useEffect(() => {
    const filteredList = searchFilter(originalData);
    setSharePasswordsList(filteredList);
  }, [searchValue]);

  const sharingListElements = [];
  sharePasswordsList.map((share, index) => {
    if (share.status === "Accepted" || share.status === "Pending") {
      sharingListElements.push(
        <div className="col-div" key={index}>
          <div className="col-icon">
            <RiLockPasswordLine />
          </div>
          <a className="col-site">{share.sharedSite}</a>
          <a className="col-user">{share.sharingUser}</a>
          <a className="col-status">{share.status}</a>
          <div className="col-share-size">
            {share.status === "Accepted" && (
              <Button
                className="col-button"
                variant="info"
                onClick={() => handleSharePassword(share)}
              >
                Info
              </Button>
            )}
            {share.status === "Pending" && (
              <Button
                className="col-button"
                variant="primary"
                onClick={() => handleConfirmSharing(share._id, "Accepted")}
              >
                Accept
              </Button>
            )}
            {share.status === "Pending" && (
              <Button
                className="col-button"
                variant="danger"
                onClick={() => handleConfirmSharing(share._id, "Rejected")}
              >
                Reject
              </Button>
            )}
          </div>
        </div>
      );
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
      <div className="top-container">
        <div>
          <h3>Sharing Center</h3>
        </div>
        <div>
          <p>
            Share your passwords with your friends and family. You can also
            revoke access at any time.
          </p>
        </div>
      </div>

      <div className="main-container">
        <div className="main-body">{sharingListElements}</div>
      </div>

      <Modal show={show} onHide={handleClose} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{"Sharing Password"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Sharing User</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FaRegCircleUser />
            </InputGroup.Text>
            <Form.Control type="text" value={sharingUser} readOnly />
          </InputGroup>
          <Form.Label>Site</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FaInternetExplorer />
            </InputGroup.Text>
            <Form.Control type="text" value={sharedSite} readOnly />
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
            />
            <InputGroup.Text>
              <button className="input-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </InputGroup.Text>
            <InputGroup.Text>
              <button className="input-icon" onClick={copyPasswordToClipboard}>
                <FaCopy />
              </button>
            </InputGroup.Text>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SharingCenter;
