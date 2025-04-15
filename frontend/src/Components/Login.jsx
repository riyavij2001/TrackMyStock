import React, { useRef, useState } from 'react';
import { Button, Input } from '@heroui/react';
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
        console.log("Token received:", token);
      })
      .catch((err) => {
        console.log("Login error:", err);
        setError("Invalid email or password. Please try again.");
      });
  };

  return (
    <div id='login' className='h-[90vh] justify-items-center pt-[10rem]'>
      <div className='bg-black w-[70vh] justify-items-center h-[60vh] content-center p-8 rounded-md'>
        <h2 className='text-white text-xl mb-6'>Login</h2>

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
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}
        <div className="text-center mt-8">
          <button
            onClick={handleLogin}
            className="bg-[#4B2C46] bg-opacity-80 text-white py-3 px-5 rounded-md text-sm font-semibold hover:bg-[#B77D9D] transition-all duration-300 transform hover:scale-105"
          >
            Log In
          </button>
        </div>
        <div className='mt-8'>
          <a href="/signup">
            Don't have an account? SignUp here
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
