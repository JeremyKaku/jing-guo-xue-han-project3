import 'bootstrap/dist/css/bootstrap.min.css'
import NavBar from "./components/NavBar"
import Home from "./pages/Home"
import Login from './pages/Login'
import Signup from './pages/Signup'
import PasswordManager from './pages/PasswordManager'
import ParticlesBackground from './components/ParticlesBackground'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <ParticlesBackground />
      <Router>
        <div>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/passwordmanager" element={<PasswordManager />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
