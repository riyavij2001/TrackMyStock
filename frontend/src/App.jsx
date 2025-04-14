import "./App.css";
import NavigationBar from "./Components/CommonComponents/Navbar";
import Home from "./Components/Home";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <div
        className="min-h-screen"
        style={{
          background:
            "linear-gradient(45deg, rgba(15, 3, 23) 40%, rgba(60, 46, 76) 100%)",
        }}
      >
        <NavigationBar />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
