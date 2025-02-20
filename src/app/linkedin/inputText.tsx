"use client";
import React, { useState, useEffect } from "react";
import Modal from "@/components/Modals/BillingModal";
import { returnUserSubscription, createPost } from "@/actions/actions";

interface CreatePostProps {
    onFormSubmit: (post: string | "") => void;
}

const CreatePosts: React.FC<CreatePostProps> = ({ onFormSubmit }) => {
    interface Subscription {
        id: number;
        userId: number;
        packageId: number;
        startDate: Date;
        endDate: Date;
        statusId: number;
        monthlyUsage: number;
    }

    const [loading, setLoading] = useState<boolean>(false);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchSubscription = async () => {
            const data = await returnUserSubscription();
            setSubscription(data);
            if (!data) {
                setIsModalOpen(true);
            }
        };
        fetchSubscription();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        onFormSubmit("")
        try {
            const formData = new FormData(event.currentTarget);
            const promptMessage = formData.get("prompt_message") as string;
            const generatedPost = await createPost(promptMessage);
            onFormSubmit(generatedPost);

        } catch (error) {
            console.error("Error submitting form:", error);
            // Handle error (e.g., display an error message)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
            <div className="flex flex-col gap-9">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            {`</>`}
                        </h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6.5">

                            <div className="mb-6">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Main Prompt
                                </label>
                                <textarea
                                    rows={6}
                                    name="prompt_message"
                                    placeholder="Type your main prompt here. Be detailed and add extra instructions if possible."
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                ></textarea>
                            </div>
                            {loading ? (
                                <div className="flex justify-center">
                                    <div>Loading...</div>
                                </div>
                            ) : (
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                                >
                                    Generate post
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
            {isModalOpen && <Modal />}
        </div>

    );
};

export default CreatePosts;
