import React, { useRef, useState } from 'react';
import { Button, Input } from '@heroui/react';
import axios from 'axios';

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
        const firstName = firstNameRef.current?.value || '';
        const lastName = lastNameRef.current?.value || '';
        const email = emailRef.current?.value || '';
        const password = passwordRef.current?.value || '';
        const confirmPassword = confirmPasswordRef.current?.value || '';

        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        } else {
            setPasswordError("");
        }

        const config = {
            method: "post",
            url: `http://localhost:8181/api/v1/register`,
            data: {
                firstName,
                lastName,
                email,
                password
            }
        };

        axios(config)
            .then((res) => {
                setToken(res.data.token);
                setError(""); // clear any previous error
                console.log("Token received:", res.data.token);
            })
            .catch((err) => {
                const errorMsg = err.response?.data?.message || "Sign up failed. Please try again.";
                console.log("Signup error:", err);
                setToken('');
                setError(errorMsg);
            });
    };

    return (
        <div id='signup' className='h-[90vh] justify-items-center pt-[0.5rem]'>
            <div className='bg-black w-[70vh] justify-items-center h-[fit-content] content-center p-8 rounded-md'>
                <h2 className='text-white text-xl mb-6'>Sign Up</h2>
                <Input
                    isRequired
                    className="max-w-xs p-2 mb-4"
                    placeholder="Enter your first name"
                    label="First Name"
                    type="text"
                    ref={firstNameRef}
                />
                <Input
                    isRequired
                    className="max-w-xs p-2 mb-4"
                    placeholder="Enter your last name"
                    label="Last Name"
                    type="text"
                    ref={lastNameRef}
                />
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
                    <Input
                        isRequired
                        className="max-w-xs p-2 mb-4"
                        placeholder="Confirm your password"
                        label="Confirm Password"
                        type="password"
                        ref={confirmPasswordRef}
                    />
                    {passwordError && (
                        <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                    )}

                {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                )}

                <div className="text-center mt-8">
                    <button
                        onClick={handleSignUp}
                        className="bg-[#4B2C46] bg-opacity-80 text-white py-3 px-5 rounded-md text-sm font-semibold hover:bg-[#B77D9D] transition-all duration-300 transform hover:scale-105"
                    >
                        Sign Up
                    </button>
                </div>
                <div className=' mt-5'>
                    <a href="/login">

                    Already have an account? Login here
                    </a>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
