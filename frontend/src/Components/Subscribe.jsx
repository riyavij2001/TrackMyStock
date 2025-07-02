import { Autocomplete, AutocompleteItem, Button } from "@heroui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

function Subscribe() {
  const [searchResult, setSearchResult] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const resetPage = () => {
    setSearchWord("");
    setSearchResult([]);
    setSelectedTags([]);
  };

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
        setSearchResult(res.data || []);
      })
      .catch((err) => {
        console.error(err);
        setSearchResult([]);
      });
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getSearchResults();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchWord]);

  const handleTagSelection = (option) => {
    if (!selectedTags.some((tag) => tag.id === option.id)) {
      setSelectedTags([...selectedTags, option]);
    }
  };

  const handleTagRemoval = (indexToRemove) => {
    setSelectedTags(selectedTags.filter((_, index) => index !== indexToRemove));
  };

  const handleSubscibe = () => {
    if (selectedTags.length === 0) return;
    const config = {
      method: "post",
      url: `http://localhost:8181/api/v1/subscribe`,
      data: { stock_ids: selectedTags.map((tag) => tag.id) },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true,
    };

    axios(config)
      .then((res) => {
        resetPage();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="py-16 text-gray-300 min-h-screen" id="subscribe">
      {/* Heading */}
      <div className="text-center text-4xl font-bold text-[#a8d603]">
        Stay Updated with Real-Time Stock Alerts
      </div>

      {/* Description */}
      <div className="mt-8 px-6 text-lg text-gray-400 text-center max-w-4xl mx-auto">
        Subscribe to receive daily email notifications about your selected
        stock's performance. Get the latest updates, market trends, and crucial
        movements delivered straight to your inbox, so you never miss an
        important change. Stay ahead in the market with timely insights tailored
        to your stock preferences.
      </div>

      {/* Search stocks to subscribe Section */}
      <div className="w-full sm:w-[35rem] text-center m-auto mt-20">
        <Autocomplete
          value={searchWord}
          onValueChange={setSearchWord}
          className="bg-[#2F2F2F] text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-[#3A3A3A] transition-all duration-300"
          label="Search for a Stock"
        >
          {searchResult.length > 0 ? (
            searchResult.map((res, i) => (
              <AutocompleteItem
                key={i}
                onClick={() => handleTagSelection(res)}
                className="py-2 px-4 hover:bg-[#a8d603] rounded-lg cursor-pointer"
              >
                {res.label}
              </AutocompleteItem>
            ))
          ) : (
            <AutocompleteItem disabled className="text-gray-500 py-2">
              No results found
            </AutocompleteItem>
          )}
        </Autocomplete>

        {/* Selected Tags */}
        <div className="mt-6 flex flex-wrap gap-3">
          {selectedTags.map((tag, index) => (
            <div
              key={index}
              className="bg-[#2F2F2F] text-white py-2 px-4 rounded-lg flex items-center gap-2"
            >
              <span>{tag.id}</span>
              <button
                onClick={() => handleTagRemoval(index)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Subscribe Button */}
        {selectedTags?.length > 0 && (
          <div className="text-center mt-12" onClick={handleSubscibe}>
            <p className="bg-[#a8d603] text-black py-3 px-6 rounded-lg text-lg font-semibold hover:bg-[#94c102] transition-all duration-300 transform hover:scale-105">
              Subscribe
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Subscribe;
