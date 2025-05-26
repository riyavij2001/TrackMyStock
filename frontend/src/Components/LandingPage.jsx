import { Button } from '@heroui/react'
import React from 'react'
import ArrowCircleDownOutlinedIcon from '@mui/icons-material/ArrowCircleDownOutlined';
import Statistics from './Statistics';
import Tagline from './Tagline';
import Cards from './Cards';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
// import {StockImage} from '../Components/Icons/stocks.jpg';

function LandingPage() {
  const navigate  = useNavigate();
  return (
    <span>
      <div className="sm:grid grid-cols-2 text-white p-8 mt-6 sm:mt-20 text-center" id='home'>
        {/* Left Column (Content) */}
        <div className="flex flex-col justify-left w-4/5 m-auto space-y-2">
          <span className='space-y-3 '>
            <h4>Keep your investments safe <span className=' text-[#a8d603]'>!</span></h4>
            <h1 className="text-3xl font-bold">
              <span className='text-[#a8d603]'> Track Your Stocks </span> in Real-Time – Stay Ahead of the Market!
            </h1>
          </span>
          <span className='space-y-8'>
            <p className="text-lg">
              Instant insights and up-to-date stock details at your fingertips – no more guessing, just informed investing.
            </p>
            <div className="relative w-full max-w-xs mx-auto" onClick={()=> navigate("/stocks")}>
              <div className="bg-[#a8d603] bg-opacity-80 text-white py-3 px-6 rounded-full text-xl font-semibold flex items-center justify-between cursor-pointer hover:bg-[#87aa0a] transition-all duration-300 transform hover:scale-105">
                <span className="ml-4">Get Started</span>
                <ArrowCircleDownOutlinedIcon className="text-white mr-4" />
              </div>
            </div>
          </span>
        </div>


        {/* Right Column (Image) */}
        <div className=" mt-12">
          <span className=' flex justify-center'>

            <img src="src/Components/Icons/stocks.jpg" alt="Stock Image" className=' w-[13rem] h-[24rem] rounded-[1.5rem]' />
          </span>
          {/* Disclaimer */}
          <p className="text-center text-xs text-gray-400 mt-4">
            Please note: The stock data displayed here is for demonstration purposes only and does not reflect real-time market information.
          </p>
        </div>
      </div>
      <div><Statistics /></div>
      <div><Tagline /></div>
      <div>
        <Cards />
      </div>
      <div className="bg-[#1E1E1E] text-white py-12 px-6 mt-8 rounded-lg shadow-lg mx-auto w-[90%] sm:w-[70%] text-center">
        <h2 className="text-2xl font-bold mb-4">
          Stay Updated with the Latest Market Trends!
        </h2>
        <p className="text-gray-300 mb-6">
          Subscribe to our daily updates and never miss out on important stock market insights.
        </p>
        <Button className="bg-[#a8d603] text-black font-semibold py-3 px-8 rounded-lg hover:bg-[#94c102] transition-all">
          Subscribe Now
        </Button>
      </div>
      <div>
        <Footer />
      </div>
    </span>

  )
}

export default LandingPage