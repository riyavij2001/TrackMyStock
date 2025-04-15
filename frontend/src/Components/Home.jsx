import { Navbar } from '@heroui/react'
import React from 'react'
import LandingPage from './LandingPage'
import AboutUs from './AboutUs'
import Subscribe from './Subscribe'
import Stocks from './Stocks'
import NavigationBar from './CommonComponents/Navbar'

function Home() {
    return (
        <div>
            <LandingPage />
            <AboutUs />
            <Subscribe />
            <Stocks />
            <footer id="footer" className="bg-black text-white py-6 mt-16">
                <div className="text-center">
                    <h3 className="text-lg font-bold">Contact Us</h3>
                    <p className="mt-2">Email: support@trackmystocks.in</p>
                    <p>Phone: +91 98765 43210</p>
                    <p>Address: 456 Stock Avenue, Mumbai, India</p>
                </div>
            </footer>
        </div>
    )
}

export default Home