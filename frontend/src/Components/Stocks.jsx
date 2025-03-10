import { Autocomplete, AutocompleteItem } from "@heroui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

function Stocks() {
  const [searchResult, setSearchResult] = useState([]);
  const [searchWord, setSearchWord] = useState("");
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
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getSearchResults();
  }, [searchWord]);

  return (
    <div className="min-h-screen py-16 sm:mt-16">
      {/* Search Stocks Heading */}
      <div className="text-center text-4xl font-bold text-white">
        Search Stocks
      </div>

      {/* About Text Block */}
      <div className="mt-8 px-6 text-xl text-gray-200 text-center max-w-4xl mx-auto">
        Welcome to{" "}
        <span className="text-[#DC9EBF] font-bold">Track My Stocks</span> – your
        personalized, real-time stock tracker designed to keep you informed and
        ahead of the curve. Whether you're a seasoned investor, just starting
        your journey, or simply tracking your favorite companies, we're here to
        make stock tracking easier, smarter, and more accessible.
      </div>
      <div className=" w-[35rem] text-center m-auto mt-20">
        <Autocomplete
          value={searchWord}
          onValueChange={setSearchWord}
          className="bg-[#4B2C46] bg-opacity-80  text-white py-3 px-6 rounded-lg text-xl font-semibold hover:bg-[#B77D9D] transition-all duration-300 transform hover:scale-105"
          label="Search for a Stock"
        >
          {searchResult.map((res, i) => (
            <AutocompleteItem key={i}>{res.label}</AutocompleteItem>
          ))}
        </Autocomplete>
      </div>
    </div>
  );
}

export default Stocks;
