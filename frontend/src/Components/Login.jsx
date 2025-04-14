import React, { useRef, useState } from "react";
import { Button, Input } from "@heroui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [token, setToken] = useState("");
  const navigate = useNavigate("");

  const handleLogin = () => {
    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    const config = {
      method: "post",
      url: `http://localhost:8181/api/v1/login`,
      data: { email, password },
      withCredentials: true,
    };

    axios(config)
      .then((res) => {
        setToken(res.data.token);
        console.log("Token received:", res.data.token);
        localStorage.setItem("token", res.data.token);
        navigate("/");
      })
      .catch((err) => {
        console.log("Login error:", err);
        setToken("");
      });
  };

  return (
    <div id="login" className="h-[90vh] justify-items-center pt-[10rem]">
      <div className="bg-black w-[70vh] justify-items-center h-[60vh] content-center p-8 rounded-md">
        <h2 className="text-white text-xl mb-6">Login</h2>

        <Input
          isRequired
          className="max-w-xs p-2 mb-4"
          placeholder="Enter your email address"
          label="Email"
          type="email"
          ref={emailRef}
        />
        <Input
          isRequired
          className="max-w-xs p-2 mb-4"
          placeholder="Enter your password"
          label="Password"
          type="password"
          ref={passwordRef}
        />
        <div className="text-center mt-8">
          <button
            onClick={handleLogin}
            className="bg-[#4B2C46] bg-opacity-80 text-white py-3 px-5 rounded-md text-sm font-semibold hover:bg-[#B77D9D] transition-all duration-300 transform hover:scale-105"
          >
            Log In
          </button>
        </div>
        <div className=" mt-8">
          <a href="/signup">Don't have an account? SignUp here</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
