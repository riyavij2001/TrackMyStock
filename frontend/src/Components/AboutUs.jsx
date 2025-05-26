import React from 'react';

function AboutUs() {
    return (
        <div className="min-h-screen py-16 sm:mt-16  text-gray-300" id="aboutUs">
            {/* About Us Heading */}
            <div className="text-center text-4xl font-bold text-[#a8d603]">
                About Us
            </div>

            {/* About Text Block */}
            <div className="mt-8 px-6 text-lg text-gray-400 text-center max-w-4xl mx-auto">
                Welcome to <span className="text-[#a8d603] font-bold">Track My Stocks</span> – your personalized,
                real-time stock tracker designed to keep you informed and ahead of the curve. Whether you're a
                seasoned investor, just starting your journey, or simply tracking your favorite companies,
                we're here to make stock tracking easier, smarter, and more accessible.
            </div>

            {/* What We Do Heading */}
            <div className="text-[#a8d603] font-bold text-3xl text-center mt-14">
                What We Do?
            </div>

            {/* What We Do Content */}
            <div className="mt-10 px-6 text-lg text-gray-400 text-center max-w-4xl mx-auto">
                At Track My Stocks, we bring you the latest stock market data at your fingertips.
                With our cutting-edge web scraper, we gather live updates on stock prices, trends,
                and news from a variety of companies. But we don't stop there—our daily update feature
                ensures that you never miss out on important changes for the stocks you care about.
                Simply subscribe to your favorite stocks, and we'll deliver fresh, daily insights directly to your inbox.
            </div>

            {/* Why Choose Us Heading */}
            <div className="mt-16 text-[#a8d603] font-bold text-3xl text-center">
                Why Choose Us?
            </div>

            {/* Features Grid */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6 text-gray-400 text-lg max-w-5xl mx-auto">
                {/* Feature 1 */}
                <div className="bg-[#2F2F2F] p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
                    <h3 className="text-2xl font-semibold text-[#a8d603]">Real-Time Data</h3>
                    <p className="mt-4">Get live updates on stock prices, market trends, and more to stay ahead of the market.</p>
                </div>

                {/* Feature 2 */}
                <div className="bg-[#2F2F2F] p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
                    <h3 className="text-2xl font-semibold text-[#a8d603]">Daily Stock Updates</h3>
                    <p className="mt-4">Subscribe to your favorite stocks and receive daily email summaries with all the important changes.</p>
                </div>

                {/* Feature 3 */}
                <div className="bg-[#2F2F2F] p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
                    <h3 className="text-2xl font-semibold text-[#a8d603]">Comprehensive Coverage</h3>
                    <p className="mt-4">Track stocks from a wide range of industries, ensuring you're always in the know about the companies that matter most.</p>
                </div>
            </div>

            {/* Call-to-Action Button */}
            <div className="text-center mt-16">
                <a href="/subscribe" className="bg-[#a8d603] text-black py-3 px-6 rounded-lg text-xl font-semibold hover:bg-[#94c102] transition-all duration-300 transform hover:scale-105">
                    Start Tracking Today
                </a>
            </div>
        </div>
    );
}

export default AboutUs;
