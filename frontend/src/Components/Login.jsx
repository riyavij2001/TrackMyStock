import React from 'react'
import NavigationBar from './CommonComponents/Navbar'
import { Input } from '@heroui/react'

function Login() {
    return (
        <div id='login'>
            <NavigationBar />
            <div className=' bg-white w-96'>
                <Input
                    isRequired
                    className="max-w-xs"
                    placeholder="Enter your email address"
                    label="Email"
                    type="email"
                />
                <Input
                    isRequired
                    className="max-w-xs"
                    placeholder="Enter your password"
                    label="Password"
                    type="password"
                />
            </div>
        </div>
    )
}

export default Login