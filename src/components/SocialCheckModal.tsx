"use client";

import React from "react";

interface SocialCheckModalProps {
    isOpen: boolean;
    isLoading: boolean;
    onClose: () => void;
    results: { name: string; available: boolean; url: string }[];
}

const SocialCheckModal: React.FC<SocialCheckModalProps> = ({ isLoading, isOpen, onClose, results }) => {
    if (!isOpen) return null;
    if (isLoading) return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Social Media Availability</h2>
                <div>Checking availability...</div>
                <button
                    onClick={onClose}
                    className="mt-4 bg-gray-600 text-white py-2 px-4 rounded"
                >
                    Close
                </button>
            </div>
        </div>
    )
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Social Media Availability</h2>
                <ul>
                    {results.map((platform, index) => (
                        <li key={index} className="flex justify-between py-2 border-b">
                            <span>{platform.name}</span>
                            {platform.available ? (
                                <span className="text-green-600">
                                    <a
                                        href={platform.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 underline"
                                    >
                                        Available ✅
                                    </a>
                                </span>
                            ) : (
                                <a
                                    href={platform.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-red-600 underline"
                                >
                                    Taken ❌
                                </a>
                            )}
                        </li>
                    ))}
                </ul>
                <button
                    onClick={onClose}
                    className="mt-4 bg-gray-600 text-white py-2 px-4 rounded"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default SocialCheckModal;
