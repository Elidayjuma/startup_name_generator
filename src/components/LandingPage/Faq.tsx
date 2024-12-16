"use client";
import React from "react";
import { Container } from "@/components/LandingPage/Container";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

export const Faq = () => {
    return (
        <Container className="!p-0">
            <div className="w-full max-w-2xl p-2 mx-auto rounded-2xl">
                {faqdata.map((item, index) => (
                    <div key={item.question} className="mb-5">
                        <Disclosure>
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="flex items-center justify-between w-full px-4 py-4 text-lg text-left text-gray-800 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-indigo-100 focus-visible:ring-opacity-75 dark:bg-trueGray-800 dark:text-gray-200">
                                        <span>{item.question}</span>
                                        <ChevronUpIcon
                                            className={`${open ? "transform rotate-180" : ""
                                                } w-5 h-5 text-indigo-500`}
                                        />
                                    </DisclosureButton>
                                    <DisclosurePanel className="px-4 pt-4 pb-2 text-gray-500 dark:text-gray-300">
                                        {item.answer}
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>
                    </div>
                ))}
            </div>
        </Container>
    );
}

const faqdata = [
    {
        question: "What is NenoPress?",
        answer: "NenoPress helps bloggers automatically generate content for their blogs, saving time while improving productivity and consistency."
    },
    {
        question: "How does NenoPress work?",
        answer: "Simply input your blog topic and NenoPress will generate high-quality posts, which you can customize and publish directly to your blog."
    },
    {
        question: "Is there a free trial?",
        answer: "Currently, we offer a paid subscription model, but you can cancel anytime if you're not satisfied with the service."
    },
    {
        question: "Can I customize the generated content?",
        answer: "Yes, all generated content is fully editable, giving you the freedom to make adjustments before publishing."
    },
    {
        question: "How many blog posts can I generate with each plan?",
        answer: "The Basic plan allows up to 15 posts per month, the Advanced plan offers 30, and the Premium plan provides unlimited posts."
    }
];
