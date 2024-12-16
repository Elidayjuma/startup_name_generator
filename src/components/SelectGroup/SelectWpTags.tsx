import React, { useState, useEffect } from "react";
import { getWordpressSiteTags, returnSingleSite } from "@/actions/actions";

const SelectWpTags: React.FC<{ onTagSelect: (tagId: string) => void, siteId: string }> = ({ onTagSelect, siteId }) => {
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
    const [tags, setTags] = useState<any[]>([]); // Type as needed
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const changeTextColor = () => {
        setIsOptionSelected(true);
    };

    const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const tagId = event.target.value;
        setSelectedOption(tagId);
        setIsOptionSelected(true);
        onTagSelect(tagId);
    };

    useEffect(() => {
        if (!siteId) {
            setTags([]);
            setLoading(false);
            return;
        }

        const fetchTags = async () => {
            setLoading(true);
            setError(null);

            try {
                const site = await returnSingleSite(parseInt(siteId));
                if (!site) throw new Error("Site not found");
                const response = await getWordpressSiteTags(site);
                setTags(response);
            } catch (err: any) {
                console.error("Error fetching tags:", err);
                setError("Failed to load tags. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, [siteId]); // Re-fetch tags whenever siteId changes

    if (loading) {
        return <div>Loading...</div>; // A loading state or spinner can be rendered here
    }
    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="w-full xl:w-1/2 mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
                WordPress Tag
            </label>

            <div className="relative z-20 bg-transparent dark:bg-form-input">
                <select
                    value={selectedOption}
                    onChange={handleSelect}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? "text-black dark:text-white" : ""}`}
                >
                    <option value="" disabled className="text-body dark:text-bodydark">
                        Select tag
                    </option>
                    {tags.map((tag, index) => {
                        return (
                            <option key={index} value={tag.id} className="text-body dark:text-bodydark">
                                {tag.name}
                            </option>
                        );
                    })}
                </select>

                <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                    <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g opacity="0.8">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                fill=""
                            ></path>
                        </g>
                    </svg>
                </span>
            </div>
        </div>
    );
};

export default SelectWpTags;
