import { useContext, useEffect } from "react";
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
  const searchValue = contextValue.searchValue;
  const setSearchValue = contextValue.setSearchValue;
  const userName = contextValue.user;
  const navBarActive = contextValue.navBarActive;
  const setNavBarActive = contextValue.setNavBarActive;
  const navigate = useNavigate();

  const handleNavbarClick = (nav) => {
    setNavBarActive(nav);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout");
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (value) => {
    console.log(value);
    setSearchValue(value);
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
                <Nav.Link
                  as={Link}
                  to="/passwordmanager"
                  className={navBarActive === "Passwords" ? "active" : ""}
                  onClick={() => handleNavbarClick("Passwords")}
                >
                  Passwords
                </Nav.Link>
              )}
              {isLoggedIn && (
                <Nav.Link
                  as={Link}
                  to="/sharingcenter"
                  className={navBarActive === "Sharing Center" ? "active" : ""}
                  onClick={() => handleNavbarClick("Sharing Center")}
                >
                  Sharing Center
                </Nav.Link>
              )}
            </Nav>
            {isLoggedIn && (
              <Form className="d-flex me-auto search-form">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <br />
              </Form>
            )}
            <br />
            <Nav className="ms-auto my-2 my-lg-0">
              {!isLoggedIn && (
                <Nav.Link
                  as={Link}
                  to="/login"
                  className={navBarActive === "Login" ? "active" : ""}
                  onClick={() => handleNavbarClick("Login")}
                >
                  Login
                </Nav.Link>
              )}
              {!isLoggedIn && (
                <Nav.Link
                  as={Link}
                  to="/signup"
                  className={navBarActive === "Signup" ? "active" : ""}
                  onClick={() => handleNavbarClick("Signup")}
                >
                  Sign up
                </Nav.Link>
              )}
              <div className="d-flex justify-content-end">
                {isLoggedIn && <FaUserCircle className="icon" />}
                {isLoggedIn && (
                  <NavDropdown title={userName} id="navbarScrollingDropdown">
                    <NavDropdown.Item href="#action3" onClick={handleLogout}>
                      Sign out
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
