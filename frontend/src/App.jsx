import './App.css'
import AboutUs from './Components/AboutUs'
import Navbar from './Components/CommonComponents/Navbar'
import Home from './Components/Home'
import LandingPage from './Components/LandingPage'
import Login from './Components/Login'
import Stocks from './Components/Stocks'
import Subscribe from './Components/Subscribe'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {

  return (
    <>
      <div className="min-h-screen"
        style={{
          background: 'linear-gradient(45deg, rgba(15, 3, 23) 40%, rgba(60, 46, 76) 100%)',
        }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
