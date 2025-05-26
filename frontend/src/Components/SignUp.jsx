import React, { useRef, useState } from "react";
import { Input } from "@heroui/react";
import axios from "axios";

function SignUp() {
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSignUp = () => {
    const firstName = firstNameRef.current?.value || "";
    const lastName = lastNameRef.current?.value || "";
    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    const confirmPassword = confirmPasswordRef.current?.value || "";

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    } else {
      setPasswordError("");
    }

    const config = {
      method: "post",
      url: `http://localhost:8181/api/v1/register`,
      data: { firstName, lastName, email, password },
      withCredentials: true,
    };

    axios(config)
      .then((res) => {
        setToken(res.data.token);
        setError("");
        console.log("Token received:", res.data.token);
      })
      .catch((err) => {
        const errorMsg =
          err.response?.data?.message || "Sign up failed. Please try again.";
        console.log("Signup error:", err);
        setToken("");
        setError(errorMsg);
      });
  };

  return (
    <div id="signup" className="min-h-screen flex items-center justify-center text-gray-300">
      <div className="w-full max-w-md bg-[#2F2F2F] p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-[#a8d603] mb-6">Sign Up</h2>

        {passwordError && (
          <p className="text-red-500 text-sm mb-2">{passwordError}</p>
        )}

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form className="space-y-5">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-2">
              First Name
            </label>
            <Input
              isRequired
              id="firstName"
              placeholder="Enter your first name"
              type="text"
              ref={firstNameRef}
              className="w-full p-3 rounded-lg bg-[#3A3A3A] text-white focus:outline-none focus:ring-2 focus:ring-[#a8d603]"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-2">
              Last Name
            </label>
            <Input
              isRequired
              id="lastName"
              placeholder="Enter your last name"
              type="text"
              ref={lastNameRef}
              className="w-full p-3 rounded-lg bg-[#3A3A3A] text-white focus:outline-none focus:ring-2 focus:ring-[#a8d603]"
            />
          </div>
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
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <Input
              isRequired
              id="confirmPassword"
              placeholder="Confirm your password"
              type="password"
              ref={confirmPasswordRef}
              className="w-full p-3 rounded-lg bg-[#3A3A3A] text-white focus:outline-none focus:ring-2 focus:ring-[#a8d603]"
            />
          </div>

          <button
            type="button"
            onClick={handleSignUp}
            className="w-full bg-[#a8d603] text-black font-semibold py-3 rounded-lg hover:bg-[#94c102] transition-all"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-[#a8d603] hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
