"use client";

import React, { useState } from "react";
import { generateNames } from "@/actions/actions";
import NameCard from "./NameCard";

const SearchForm: React.FC = () => {
    const [keyword, setKeyword] = useState("");
    const [names, setNames] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerateNames = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        const generatedNames = (await generateNames(keyword)) ?? [];


        if (generatedNames.length === 0) {
            setError("Failed to generate names. Try again.");
        }

        setNames(generatedNames);
        setLoading(false);
    };

    return (
        <div className="mx-auto">
            {/* Search Form */}
            <form onSubmit={handleGenerateNames} className="mb-4 max-w-md mx-auto">
                <label htmlFor="default-search" className="sr-only">
                    Generate
                </label>
                <div className="relative">
                    <input
                        type="text"
                        id="default-search"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter Keywords..."
                        required
                    />
                    <button
                        type="submit"
                        className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2"
                        disabled={loading}
                    >
                        {loading ? "Generating..." : "Generate"}
                    </button>
                </div>
            </form>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Display Generated Names */}
            {names.length > 0 && (
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">Generated Names:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {names.map((name, index) => (
                            <NameCard key={index} name={name} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchForm;
