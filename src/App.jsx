import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PasswordManager from "./pages/PasswordManager";
import ParticlesBackground from "./components/ParticlesBackground";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainContextProvider from "./context/mainContextProvider";

function App() {
  return (
    <>
      <ParticlesBackground />
      <Router>
        <div>
          <MainContextProvider>
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/passwordmanager" element={<PasswordManager />} />
            </Routes>
          </MainContextProvider>
        </div>
      </Router>
    </>
  );
}

export default App;
