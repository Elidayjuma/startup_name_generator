"use client";
import React, { useEffect, useState } from "react";
import { DocumentDuplicateIcon } from "@heroicons/react/24/solid";
import {
    TwitterShareButton,
    TwitterIcon,
} from 'next-share'

const TweetGrid: React.FC<{ tweets: string[] }> = ({ tweets }) => {
    const [editedTweets, setEditedTweets] = useState<string[]>([]);

    // Synchronize editedTweets with the tweets prop
    useEffect(() => {
        setEditedTweets(tweets);
    }, [tweets]);

    const handleCopy = (tweet: string) => {
        navigator.clipboard.writeText(tweet);
        alert("Tweet copied to clipboard!");
    };

    const handleEdit = (index: number, newText: string) => {
        const updatedTweets = [...editedTweets];
        updatedTweets[index] = newText;
        setEditedTweets(updatedTweets);
    };

    const handleSchedule = (tweet: string) => {
        alert(`Scheduling tweet: ${tweet}`);
        // Add scheduling logic here
    };

    const handlePublish = (tweet: string) => {
        alert(`Publishing tweet: ${tweet}`);
        // Add publishing logic here
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {editedTweets.map((tweet, index) => {
                return (
                    <div
                        key={index}
                        className="border rounded-lg p-4 shadow-md relative bg-white"
                    >
                        {/* Copy Icon */}
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-blue-600"
                            onClick={() => handleCopy(tweet)}
                        >
                            <DocumentDuplicateIcon className="size-6" />
                        </button>

                        {/* Editable Tweet Text */}
                        <textarea
                            rows={6}
                            className="w-full border rounded-lg p-2 mb-4 text-gray-800 resize-none focus:outline-none focus:ring focus:ring-blue-300"
                            value={tweet}
                            onChange={(e) => handleEdit(index, e.target.value)}
                        />

                        {/* Action Buttons */}
                        <div className="flex justify-between mt-0">
                            <button
                                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                                onClick={() => handleSchedule(tweet)}
                            >
                                Schedule
                            </button>
                            {/* <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                onClick={() => handlePublish(tweet)}
                            >
                                Publish
                            </button> */}
                            <TwitterShareButton
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                url={'#'}
                                title={tweet}
                            >
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                // onClick={() => handlePublish(tweet)}
                                >
                                    Publish
                                    {/* <TwitterIcon size={32} round /> */}
                                </button>
                            </TwitterShareButton>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default TweetGrid;
