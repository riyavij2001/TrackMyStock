import { Autocomplete, AutocompleteItem } from "@heroui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

function Stocks() {
  const [searchResult, setSearchResult] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const [selectedStock, setSelectedStock] = useState({});
  const [stockResult, setStockResult] = useState(null);

  const getSearchResults = () => {
    if (searchWord.trim() === "") {
      setSearchResult([]);
      return;
    }
    const config = {
      method: "get",
      url: `http://localhost:8181/api/v1/fetchStockData?term=${searchWord}`,
      headers: {},
    };
    axios(config)
      .then((res) => {
        setSearchResult(res.data);
      })
      .catch((err) => {
        console.log(err);
        setSearchResult([]);
        setSelectedStock({});
      });
  };

  const getStockDetails = () => {
    const config = {
      method: "get",
      url: `http://localhost:8181/api/v1/fetchStockDetails?stock_id=${selectedStock.id}`,
      headers: {},
    };
    axios(config)
      .then((res) => {
        setStockResult(res.data);
      })
      .catch((err) => {
        console.log(err);
        setStockResult(null);
      });
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
    <div className="min-h-screen py-16 text-gray-300" id="stocks">
      {/* Search Stocks Heading */}
      <div className="text-center text-4xl font-bold text-[#a8d603]">
        Search Stocks
      </div>

      {/* About Text Block */}
      <div className="mt-8 px-6 text-lg text-gray-400 text-center max-w-4xl mx-auto">
        Welcome to{" "}
        <span className="text-[#a8d603] font-bold">Track My Stocks</span> – your
        personalized, real-time stock tracker designed to keep you informed and
        ahead of the curve. Whether you're a seasoned investor, just starting
        your journey, or simply tracking your favorite companies, we're here to
        make stock tracking easier, smarter, and more accessible.
      </div>

      {/* Stock Info Box */}
      <div className="mx-auto w-full sm:w-[35rem] bg-[#2F2F2F] p-8 rounded-xl shadow-lg text-white relative mt-16">
        <div className="text-center">
          <Autocomplete
            value={searchWord}
            onValueChange={setSearchWord}
            onSelectionChange={(key) => {
              let result = searchResult.find((option) => option.id === key);
              setSelectedStock(result || {});
            }}
            className="text-white py-3 px-6 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#a8d603] transition-all duration-300 w-full bg-transparent"
            label="Search for a Stock"
          >
            {searchResult.map((res, i) => (
              <AutocompleteItem
                key={res.id}
                className="bg-[#3A3A3A] text-white hover:bg-[#4A4A4A] py-2 px-4"
              >
                {res.label}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>

        {stockResult ? (
          <div className="mt-8">
            <div className="text-3xl font-semibold mb-4 text-[#a8d603]">
              {stockResult?.name}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xl font-medium">Closing Price</div>
                <div className="text-lg">₹{stockResult?.close}</div>
              </div>
              <div>
                <div className="text-xl font-medium">Change</div>
                <div className="text-lg">{stockResult?.change}</div>
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
          <div className="text-lg text-center text-gray-400 mt-8">
            Select a stock to see the information
          </div>
        )}
      </div>
    </div>
  );
}

export default Stocks;
