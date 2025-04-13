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
            <Stocks /></div>
    )
}

export default Home