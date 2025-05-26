import { Button } from '@heroui/react'
import React from 'react'
import ArrowCircleDownOutlinedIcon from '@mui/icons-material/ArrowCircleDownOutlined';
import Statistics from './Statistics';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import {StockImage} from '../Components/Icons/stocks.jpg';

function Tagline() {
    return (
        <span>
            <div className="flex items-center text-white p-8 mt-6 sm:mt-20" id="home">
                {/* Left Column (Heading) */}
                <div className="flex-1 text-right p-6">
                    <h3 className="text-2xl font-bold">
                        Empower your <span className="text-[#a8d603]">investments</span> with confidence!
                    </h3>
                </div>

                {/* Middle Column (Icon) */}
                <div className="flex justify-center items-center flex-shrink-0">
                    <TrendingUpIcon className="text-[#a8d603]" style={{ fontSize: '6rem' }} />
                </div>

                {/* Right Column (Text) */}
                <div className="flex-1 text-left p-6">
                    <p className="text-md text-gray-300">
                        Track My Stocks is your trusted partner for real-time stock tracking, personalized alerts, and market insights.
                        Our platform is designed to empower investors with the tools and information they need to make smarter decisions
                        and stay ahead in the ever-changing financial markets.
                    </p>
                </div>
            </div>
        </span>
    );
}

export default Tagline;