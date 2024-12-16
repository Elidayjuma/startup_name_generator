"use client";
import React from "react";
import { Container } from "@/components/LandingPage/Container";
import { SectionTitle } from "@/components/LandingPage/SectionTitle";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import HomeLayout from "@/components/LandingPage/HomeLayout";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

export default function Home() {
    return (
        <HomeLayout>
            <Container>
                <SectionTitle
                    id="features"
                    preTitle="NenoPress Terms and Conditions"
                    title="Terms and Conditions"
                >
                    Welcome to NenoPress! By using our platform, you agree to the following
                    terms and conditions.
                    Please read them carefully before proceeding.
                </SectionTitle>

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
            </Container>
        </HomeLayout>
    );
}

const faqdata = [
    {
        question: "1. Acceptance of Terms",
        answer: "By accessing and using NenoPress, you agree to these Terms and Conditions. If you do not agree, you may not use our services."
    },
    {
        question: "2. Use of the Service",
        answer: "NenoPress is designed to assist with content creation, SEO optimization, and publishing. \n Users are responsible for ensuring that the content generated complies with applicable laws and does not violate intellectual property rights."
    },
    {
        question: "3. Pricing and Payment",
        answer: "NenoPress offers subscription plans starting at $5 and $10. \n Payments are billed monthly or annually, depending on the selected plan. \n Subscriptions are non-refundable, except as required by law."
    },
    {
        question: "4. User Responsibilities",
        answer: "You are responsible for the content you create and publish using NenoPress.\n Do not use NenoPress for unlawful, harmful, or offensive activities. \n Keep your account credentials secure and confidential."
    },
    {
        question: "5. Intellectual Property",
        answer: "NenoPress owns all rights to its platform, design, and features. \n You retain ownership of the content you create using NenoPress."
    },
    {
        question: "6. Limitations of Liability",
        answer: "NenoPress is provided on an 'as-is' basis. We do not guarantee uninterrupted service or specific results. \n NenoPress is not liable for any losses or damages arising from the use of the platform."
    },
    {
        question: "7. Cancellation and Termination",
        answer: "You may cancel your subscription at any time. Cancellation will take effect at the end of the billing cycle. \n NenoPress reserves the right to suspend or terminate accounts for violations of these terms."
    },
    {
        question: "8. Privacy",
        answer: "Your data is handled in accordance with our Privacy Policy. \nWe do not share your personal information with third parties without your consent."
    },
    {
        question: "9. Changes to Terms",
        answer: "NenoPress reserves the right to update these terms at any time. Users will be notified of significant changes via email or the platform."
    },
    {
        question: "10. Contact Us",
        answer: "If you have questions or concerns, please contact us at [insert contact information]."
    }
];