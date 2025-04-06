import { Autocomplete, AutocompleteItem } from "@heroui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

function Stocks() {
  const [searchResult, setSearchResult] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const [selectedStock, setSelectedStock] = useState({});
  const [stockResult, setStockResult] = useState(null);
  const getSearchResults = () => {
    const config = {
      method: "get",
      url: `http://localhost:8181/api/v1/fetchStockData?term=${searchWord}`,
      headers: {
        // Authorization: `Bearer ${DecryptValue(localStorage.getItem('token'))}`,
      },
    };
    axios(config)
      .then((res) => {
        setSearchResult(res.data);
      })
      .catch((err) => {
        console.log(err)
        setSearchResult([]);
        setSelectedStock({})
      })

  };

  const getStockDetails = () => {
    const config = {
      method: "get",
      url: `http://localhost:8181/api/v1/fetchStockDetails?stock_id=${selectedStock.id}`,
      headers: {
        // Authorization: `Bearer ${DecryptValue(localStorage.getItem('token'))}`,
      },
    };
    axios(config)
      .then((res) => {
        setStockResult(res.data);
      })
      .catch((err) => {
        console.log(err)
        setStockResult(null);
      })

  };

  useEffect(() => {
    if (selectedStock.id) {

      getStockDetails();
    }
  }, [selectedStock]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getSearchResults();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchWord]);



  return (
    <div className='min-h-screen py-16' id='stocks'>
      {/* Search Stocks Heading */}
      <div className="text-center text-4xl font-bold text-white">
        Search Stocks
      </div>

      {/* About Text Block */}
      <div className="mt-8 px-6 text-xl text-gray-200 text-center max-w-4xl mx-auto">
        Welcome to <span className="text-[#DC9EBF] font-bold">Track My Stocks</span> – your personalized,
        real-time stock tracker designed to keep you informed and ahead of the curve. Whether you're a
        seasoned investor, just starting your journey, or simply tracking your favorite companies,
        we're here to make stock tracking easier, smarter, and more accessible.
      </div>
      {/* Stock Info Box */}
      <div className="mx-auto w-[35rem] bg-[#4B2C46] p-8 rounded-xl shadow-lg text-white relative mt-16">
        <div className='text-center'> {/* Removed w-[35rem] and mt-20 */}
          <Autocomplete
            value={searchWord}
            onValueChange={setSearchWord}
            onSelectionChange={(key) => {
              console.log("Key to search: ", key);
              let result = searchResult.find((option) => option.id === key)
              setSelectedStock(result || {})
              console.log("Selected Result: ", result);
            }}
            className="text-white py-3 px-6 rounded-lg text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#DC9EBF] transition-all duration-300 w-full bg-transparent" // Removed background and set width to 100%
            label="Search for a Stock"
          >
            {searchResult.map((res, i) => (
              <AutocompleteItem key={res.id} className="bg-[#484848] text-white hover:bg-[#585858] py-2 px-4">
                {res.label}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>

        {/* ... (loading and error handling remain the same) */}

        {stockResult ? (
          <div className="mt-8">
            <div className="text-3xl font-semibold mb-4 text-[#DC9EBF]">{stockResult?.name}</div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xl font-medium">Closing Price</div>
                <div className="text-lg">₹{stockResult?.close}</div>
              </div>
              <div>
                <div className="text-xl font-medium">Change</div>
                <div className={`text-lg`}>
                  {stockResult?.change}
                </div>
              </div>
              <div>
                <div className="text-xl font-medium">Sector</div>
                <div className="text-lg">{stockResult?.sector}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <div className="text-xl font-medium">Altman Z Score</div>
                <div className="text-lg">{stockResult?.altman_z_score}</div>
              </div>
              <div>
                <div className="text-xl font-medium">PE Ratio</div>
                <div className="text-lg">{stockResult?.pe_ratio}</div>
              </div>
              <div>
                <div className="text-xl font-medium">{`ROE (TTM)`}</div>
                <div className="text-lg">{stockResult?.roe}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xl text-center text-gray-300 mt-8">
            Select a stock to see the information
          </div>
        )}
      </div>
    </div>
  )
}

export default Stocks;
