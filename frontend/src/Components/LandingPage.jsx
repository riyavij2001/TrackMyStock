import { Button } from '@heroui/react'
import React from 'react'

function LandingPage() {
  return (
    <div className="sm:grid grid-cols-2 text-white p-8 mt-12 sm:mt-20 text-center">
      {/* Left Column (Content) */}
      <div className="flex flex-col justify-center space-y-8 w-3/4 m-auto">
        <h1 className="text-3xl font-bold">
          Track Your <span className='text-[#DC9EBF]'> Stocks </span> in Real-Time – Stay Ahead of the Market!
        </h1>
        <p className="text-lg">
          Instant insights and up-to-date stock details at your fingertips – no more guessing, just informed investing.
        </p>
        <Button className='font-semibold text-black' color='primary'>Get Started</Button>
      </div>


      {/* Right Column (Image) */}
      <div className=" mt-16">
        <div className='flex justify-center items-centerF'>
          <table className=" min-w-32 bg-[#23172F] bg-opacity-80 border-collapse text-white table-auto rounded-lg shadow-lg select-none">
            <thead>
              <tr className="bg-[#462F64] text-white border-b-2 border-[#6A4C96]">
                <th className="py-4 px-6 text-left text-lg">Stock</th>
                <th className="py-4 px-6 text-left text-lg">Price</th>
                <th className="py-4 px-6 text-left text-lg">Change</th>
              </tr>
            </thead>
            <tbody>
              {/* Stock 1 */}
              <tr className="  transition-all border-b border-[#4A3B5E] cursor-default">
                <td className="py-4 px-6 font-medium">Tesla</td>
                <td className="py-4 px-6">$700.25</td>
                <td className="py-4 px-6 text-green-500 flex items-center">
                  <span className="mr-2">+2.34%</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-up"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 12V4m0 0L4 8m4-4l4 4" />
                  </svg>
                </td>
              </tr>

              {/* Stock 2 */}
              <tr className="  transition-all border-b border-[#4A3B5E] cursor-default">
                <td className="py-4 px-6 font-medium">Apple</td>
                <td className="py-4 px-6">$145.30</td>
                <td className="py-4 px-6 text-red-500 flex items-center">
                  <span className="mr-2">-1.56%</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-down"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 4v8m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </td>
              </tr>

              {/* Stock 3 */}
              <tr className="  transition-all border-b border-[#4A3B5E] cursor-default">
                <td className="py-4 px-6 font-medium">Amazon</td>
                <td className="py-4 px-6">$3,215.00</td>
                <td className="py-4 px-6 text-green-500 flex items-center">
                  <span className="mr-2">+0.85%</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-up"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 12V4m0 0L4 8m4-4l4 4" />
                  </svg>
                </td>
              </tr>

              {/* Stock 4 */}
              <tr className="  transition-all border-b border-[#4A3B5E] cursor-default">
                <td className="py-4 px-6 font-medium">Microsoft</td>
                <td className="py-4 px-6">$282.65</td>
                <td className="py-4 px-6 text-red-500 flex items-center">
                  <span className="mr-2">-0.32%</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-down"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 4v8m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </td>
              </tr>

              {/* Stock 5 */}
              <tr className="  transition-all border-b border-[#4A3B5E] cursor-default">
                <td className="py-4 px-6 font-medium">Netflix</td>
                <td className="py-4 px-6">$605.15</td>
                <td className="py-4 px-6 text-green-500 flex items-center">
                  <span className="mr-2">+1.27%</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-up"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 12V4m0 0L4 8m4-4l4 4" />
                  </svg>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Please note: The stock data displayed here is for demonstration purposes only and does not reflect real-time market information.
        </p>
      </div>
    </div>



  )
}

export default LandingPage