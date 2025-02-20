"use client";
import React, { useEffect, useState } from "react";
import { DocumentDuplicateIcon, PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { shareOnLinkedIn, returnLinkedInToken, returnLinkedInUser } from "@/actions/actions";

const PostEditor: React.FC<{ post: string }> = ({ post }) => {
    const [editedPost, setEditedPost] = useState<string>(post);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    // Synchronize editedPost with the post prop
    useEffect(() => {
        setEditedPost(post);
    }, [post]);

    const handleCopy = () => {
        navigator.clipboard.writeText(editedPost);
        alert("Post copied to clipboard!");
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleCancel = () => {
        setIsEditing(!isEditing);
    }

    const handlePublish = async () => {
        alert(`Publishing post: ${editedPost}`);
        setIsEditing(false);
        // Add actual publishing logic here
        const access_token = (await returnLinkedInToken())?.access_token ?? "";
        const linkedin_id = (await returnLinkedInUser())?.linkedin_id ?? "";
        shareOnLinkedIn(access_token, linkedin_id, editedPost);
    };

    return (
        <div className="max-w-2xl mt-6 p-4 border rounded-lg shadow-md bg-white">
            {/* Copy Button */}
            <button
                className="absolute top-2 right-2 text-gray-500 hover:text-blue-600"
                onClick={handleCopy}
            >
                <DocumentDuplicateIcon className="size-6" />
            </button>

            {/* Post Content (Editable or Static) */}
            {isEditing ? (
                <textarea
                    rows={30}
                    className="w-full border rounded-lg p-2 text-gray-800 resize-none focus:outline-none focus:ring focus:ring-blue-300"
                    value={editedPost}
                    onChange={(e) => setEditedPost(e.target.value)}
                />
            ) : (
                <p className="text-gray-800">{editedPost}</p>
            )}

            {/* Action Buttons */}
            <div >
                {isEditing ? (
                    <div className="flex justify-between mt-4 space-x-4">
                        <button
                            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
                            onClick={handlePublish}
                        >
                            <CheckIcon className="inline w-5 h-5 mr-2" />
                            Publish
                        </button>
                        <button
                            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                            onClick={handleCancel}
                        >
                            <XMarkIcon className="inline w-5 h-5 mr-2" />
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-between mt-4">
                        <button
                            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
                            onClick={handlePublish}
                        >
                            <CheckIcon className="inline w-5 h-5 mr-2" />
                            Publish
                        </button>
                        <button
                            className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white"
                            onClick={handleEditToggle}
                        >
                            <PencilIcon className="inline w-5 h-5 mr-2" />
                            Edit
                        </button>

                    </div>
                )}
            </div>

        </div>
    );
};

export default PostEditor;
