import './App.css';
import NavigationBar from './Components/CommonComponents/Navbar';
import Home from './Components/Home';
import AboutUs from './Components/AboutUs';
import Subscribe from './Components/Subscribe';
import Stocks from './Components/Stocks';
import ContactUs from './Components/ContactUs';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(45deg, black 40%, #2F2F2F 100%)', // Updated gradient
      }}
    >
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
