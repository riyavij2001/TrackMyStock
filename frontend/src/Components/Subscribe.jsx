import { Autocomplete, AutocompleteItem, Button } from '@heroui/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Subscribe() {
    const [searchResult, setSearchResult] = useState([]);
    const [searchWord, setSearchWord] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);

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
        if (!selectedTags.some((tag) => tag === option)) {
            setSelectedTags([...selectedTags, option]);
        }
    };

    const handleTagRemoval = (indexToRemove) => {
        setSelectedTags(selectedTags.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="py-16" id="subscribe">
            <div className="text-center text-4xl font-bold text-white">
                Stay Updated with Real-Time Stock Alerts
            </div>

            <div className="mt-8 px-6 text-xl text-gray-200 text-center max-w-4xl mx-auto">
                Subscribe to receive daily email notifications about your selected stock's performance.
                Get the latest updates, market trends, and crucial movements delivered straight to your inbox,
                so you never miss an important change. Stay ahead in the market with timely insights tailored to your stock preferences.
            </div>

            {/* Search stocks to subscribe Section */}
            <div className="w-[35rem] text-center m-auto mt-20">
                <Autocomplete
                    value={searchWord}
                    onValueChange={setSearchWord}
                    className="bg-[#4B2C46] bg-opacity-80 text-white py-3 px-6 rounded-lg text-xl font-semibold hover:bg-[#B77D9D] transition-all duration-300 transform hover:scale-105"
                    label="Search for a Stock"
                >
                    {searchResult.length > 0 ? (
                        searchResult.map((res, i) => (
                            <AutocompleteItem
                                key={i}
                                onClick={() => handleTagSelection(res.label)}
                                className="py-2 px-4 hover:bg-[#B77D9D] rounded-lg cursor-pointer"
                            >
                                {res.label}
                            </AutocompleteItem>
                        ))
                    ) : (
                        <AutocompleteItem
                            disabled
                            className="text-gray-500 py-2"
                        >
                            No results found
                        </AutocompleteItem>
                    )}
                </Autocomplete>

                {/* Selected Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {selectedTags.map((tag, index) => (
                        <div
                            key={index}
                            className="bg-[#4B2C46] text-white py-2 px-4 rounded-lg flex items-center gap-2"
                        >
                            <span>{tag}</span>
                            <button
                                onClick={() => handleTagRemoval(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                {/*Subscribe button*/}
                {selectedTags?.length > 0 &&
                    <div className="text-center mt-16">
                        <a href="/subscribe" className="bg-[#4B2C46] bg-opacity-80  text-white py-3 px-6 rounded-lg text-xl font-semibold hover:bg-[#B77D9D] transition-all duration-300 transform hover:scale-105">
                            Subscribe
                        </a>
                    </div>
                }
            </div>
        </div>
    );
}

export default Subscribe;