import { Autocomplete, AutocompleteItem } from '@heroui/react';
import React, { useState } from 'react';

const stocks = [
    { label: "TCS", key: "TCS", description: "Tata Consultancy Services" },
    { label: "INFY", key: "INFY", description: "Infosys" },
    { label: "RELIANCE", key: "RELIANCE", description: "Reliance Industries" },
    { label: "HDFC", key: "HDFC", description: "HDFC Bank" },
    { label: "ICICI", key: "ICICI", description: "ICICI Bank" },
    { label: "SBIN", key: "SBIN", description: "State Bank of India" },
    { label: "HCLTECH", key: "HCLTECH", description: "HCL Technologies" },
];


function Stocks() {
    const [stockSymbol, setStockSymbol] = useState('');
    const [stockData, setStockData] = useState(null);
    const [error, setError] = useState(null);

    const fetchStockData = async () => {
        if (!stockSymbol) return;

        const apiUrl = `https://api.example.com/stocks/${stockSymbol}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Stock not found');
            }
            const data = await response.json();
            setStockData(data);
            setError(null);
        } catch (err) {

            setError('Stock not found or invalid symbol');
            setStockData({ label: "TCS", key: "TCS", description: "Tata Consultancy Services" });
        }
    };

    const handleStockSelection = (value) => {
        console.log("reached here", value)
        setStockSymbol(value);
        setStockData({ label: "TCS", key: "TCS", description: "Tata Consultancy Services" });
        // fetchStockData();
    };


    return (
        <div className='min-h-screen py-12'>
            {/* Stock Search Heading */}
            <div className="text-center text-4xl font-bold text-white">
                Search Stocks
            </div>
            <div className="text-center mt-7 text-white">
                Get Real-Time Information on Indian Stocks at Your Fingertips
            </div>

            {/* Stock Selection Dropdown */}
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4 justify-center mt-10">
                <Autocomplete
                    className="max-w-xs"
                    label="Select a Stock"
                    color='primary'
                    variant='underlined'
                    onSelectionChange={handleStockSelection}
                >
                    {stocks.map((stock) => (
                        <AutocompleteItem key={stock.key    } >
                            {stock.label}
                        </AutocompleteItem>
                    ))}
                </Autocomplete>
            </div>

            {/* Error Handling */}
            {error && <div className="text-red-500 text-center mt-6">{error}</div>}

            {/* Display Stock Details */}
            {stockData && (
                // label: "TCS", key: "TCS", description: "Tata Consultancy Services"
                <div className="mt-12 w-4/5 mx-auto bg-[#4B2C46] p-8 rounded-lg shadow-xl text-gray-200 bg-opacity-15">
                    <h2 className="text-3xl font-semibold text-[#DC9EBF] mb-4">
                        {stockData.label}
                    </h2>
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-2xl font-bold text-white">Price: ${stockData.price}</div>
                        <div
                            className={`text-lg font-semibold ${stockData.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}
                        >
                            Trend: {stockData.trend === 'up' ? 'Up' : 'Down'}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-[#5C3D57] p-6 rounded-lg shadow-lg">
                            <h4 className="text-xl font-semibold">Market Cap</h4>
                            <p className="mt-2 text-lg">${stockData.marketCap}</p>
                        </div>
                        <div className="bg-[#5C3D57] p-6 rounded-lg shadow-lg">
                            <h4 className="text-xl font-semibold">52-Week High</h4>
                            <p className="mt-2 text-lg">${stockData.high52Weeks}</p>
                        </div>
                        <div className="bg-[#5C3D57] p-6 rounded-lg shadow-lg">
                            <h4 className="text-xl font-semibold">52-Week Low</h4>
                            <p className="mt-2 text-lg">${stockData.low52Weeks}</p>
                        </div>
                        <div className="bg-[#5C3D57] p-6 rounded-lg shadow-lg">
                            <h4 className="text-xl font-semibold">Volume</h4>
                            <p className="mt-2 text-lg">{stockData.volume}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Stocks;
