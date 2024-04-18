import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import '../styles/NavBar.css'
import { Link } from 'react-router-dom';
import '../styles/NavBar.css'
import { FaUserCircle } from "react-icons/fa";

const PasswordNavBar = () => {
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">Home</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Nav.Link as={Link} to="/passwordmanager">Password</Nav.Link>
            </Nav>

            <Form className="d-flex me-auto search-form">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-light">Search</Button><br />
            </Form><br />
            <NavDropdown title="Username" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">Sign out</NavDropdown.Item>
            </NavDropdown>
            <FaUserCircle className='icon' />

          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

export default PasswordNavBar;
