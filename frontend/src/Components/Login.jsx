import React, { useRef, useState } from 'react';
import { Input } from '@heroui/react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

function Login() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';

    const config = {
      method: "post",
      url: `http://localhost:8181/api/v1/login`,
      data: { email, password }
    };

    axios(config)
      .then((res) => {
        const token = res.data.token;
        dispatch(login(token)); // Dispatch the login action
        setError(""); // Clear any previous error
        navigate("/");
      })
      .catch((err) => {
        console.log("Login error:", err);
        setError("Invalid email or password. Please try again.");
      });
  };

  return (
    <div id="login" className="min-h-screen flex items-center justify-center text-gray-300">
      <div className="w-full max-w-md bg-[#2F2F2F] p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-[#a8d603] mb-6">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              isRequired
              id="email"
              placeholder="Enter your email address"
              type="email"
              ref={emailRef}
              className="w-full p-3 rounded-lg bg-[#3A3A3A] text-white focus:outline-none focus:ring-2 focus:ring-[#a8d603]"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <Input
              isRequired
              id="password"
              placeholder="Enter your password"
              type="password"
              ref={passwordRef}
              className="w-full p-3 rounded-lg bg-[#3A3A3A] text-white focus:outline-none focus:ring-2 focus:ring-[#a8d603]"
            />
          </div>
          <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-[#a8d603] text-black font-semibold py-3 rounded-lg hover:bg-[#94c102] transition-all"
          >
            Log In
          </button>
        </form>
        <p className="text-sm text-center mt-6">
          Don't have an account?{' '}
          <a href="/signup" className="text-[#a8d603] hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
