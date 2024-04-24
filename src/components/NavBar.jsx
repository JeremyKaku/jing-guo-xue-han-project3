import { useState, useContext, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "../styles/NavBar.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { mainContext } from "../context/mainContextProvider";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const { contextValue } = useContext(mainContext);
  const isLoggedIn = contextValue.isLoggedIn;
  const setIsLoggedIn = contextValue.setIsLoggedIn;
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout");
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {}, [isLoggedIn]);

  return (
    <>
      <Navbar
        expand="lg"
        className="bg-body-tertiary"
        bg="dark"
        data-bs-theme="dark"
      >
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            Home
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              {/* <Nav.Link as={Link} to="/">Home</Nav.Link> */}

              {isLoggedIn && (
                <Nav.Link as={Link} to="/passwordmanager">
                  Password
                </Nav.Link>
              )}

              {isLoggedIn && (
                <Form className="d-flex me-auto search-form">
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                  />
                  <Button variant="outline-light">Search</Button>
                  <br />
                </Form>
              )}
            </Nav>
            <br />{" "}
            <Nav className="ms-auto my-2 my-lg-0">
              {!isLoggedIn && (
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
              )}
              {!isLoggedIn && (
                <Nav.Link as={Link} to="/signup">
                  Sign up
                </Nav.Link>
              )}
              <div className="d-flex justify-content-end">
                {isLoggedIn && (
                  <NavDropdown title="Username" id="navbarScrollingDropdown">
                    <NavDropdown.Item href="#action3" onClick={handleLogout}>
                      Sign out
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
                {isLoggedIn && <FaUserCircle className="icon" />}
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
