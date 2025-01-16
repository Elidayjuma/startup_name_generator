'use client';
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SelectSites from "@/components/SelectGroup/SelectSites";
import SelectWpCategories from "@/components/SelectGroup/SelectWpCategories";
import SelectWpTags from "@/components/SelectGroup/SelectWpTags";
import SwitcherThree from "@/components/Switchers/selectPublish";
import SwitcherImage from "@/components/Switchers/selectImageStatus";
import Modal from "@/components/Modals/BillingModal";
import { createPrompt, returnUserSubscription } from "@/actions/actions";
import { redirect } from "next/navigation";
import { revalidatePath } from 'next/cache'

const CreatePrompt = () => {
    interface Subscription {
        id: number;
        userId: number;
        packageId: number;
        startDate: Date;
        endDate: Date;
        statusId: number;
        monthlyUsage: number;
    }

    const [siteId, setSiteId] = useState<string>("");
    const [categoryId, setCategoryId] = useState<string>("");
    const [tagId, setTagId] = useState<string>("");
    const [statusId, setStatusId] = useState<string>("0");
    const [imageStatusId, setImageStatusId] = useState<string>("0");
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

        const formData = new FormData(event.currentTarget);
        try {
            await createPrompt(formData); // Assuming createPrompt accepts FormData
            revalidatePath('/prompts')
            redirect("/prompts");
        } catch (error) {
            console.error("Error submitting form:", error);
            // Handle error (e.g., display an error message)
        } finally {
            setLoading(false);
        }
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Publish Prompt" />

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
                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <SelectSites onSiteSelect={(siteId) => setSiteId(siteId)} />
                                    <input type="hidden" name="siteId" value={siteId} />
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Express Publish
                                        </label>
                                        <SwitcherThree
                                            onOptionSelect={(statusId: string) =>
                                                setStatusId(statusId)
                                            }
                                        />
                                        <input type="hidden" name="status" value={statusId} />
                                    </div>
                                </div>
                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <SelectWpCategories onCategorySelect={(categoryId) => setCategoryId(categoryId)} siteId={siteId} />
                                    <input type="hidden" name="category_ids" value={categoryId} />
                                    <SelectWpTags onTagSelect={(tagId) => setTagId(tagId)} siteId={siteId} />
                                    <input type="hidden" name="tag_ids" value={tagId} />
                                </div>
                                {/* <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Categories (ids)
                                        </label>
                                        <input
                                            type="text"
                                            name="category_ids"
                                            placeholder="Enter category ids separated with a comma"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>

                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Tags (ids)
                                        </label>
                                        <input
                                            type="text"
                                            name="tag_ids"
                                            placeholder="Enter tag ids separated with a comma"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div> */}
                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Add Featured Image
                                        </label>
                                        <SwitcherImage
                                            onImageOptionSelect={(imageStatusId: string) =>
                                                setImageStatusId(imageStatusId)
                                            }
                                        />
                                        <input type="hidden" name="image_status" value={imageStatusId} />
                                    </div>
                                </div>

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
                                <div className="mb-6">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Research Links(Optional)
                                    </label>
                                    <textarea
                                        rows={6}
                                        name="research_links"
                                        placeholder="Type your research links here (if any). Separate each link with a comma. 
                                         'Example: https://www.example.com, https://www.example2.com'"
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
                                        Publish Post
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {isModalOpen && <Modal />}
        </DefaultLayout>
    );
};

export default CreatePrompt;
