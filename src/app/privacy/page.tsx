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
                    id="privacy"
                    preTitle="NenoPress Privacy Policy"
                    title="Privacy Policy"
                >
                    Welcome to NenoPress! Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information. Please read it carefully.
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
        question: "1. Information We Collect",
        answer: "We collect personal information such as your name, email address, and payment details when you register or use our services. We also collect data on how you interact with the platform to improve our services."
    },
    {
        question: "2. How We Use Your Information",
        answer: "Your information is used to provide, improve, and personalize our services. This includes processing payments, optimizing content suggestions, and sending important updates about your account."
    },
    {
        question: "3. Data Sharing",
        answer: "We do not sell, rent, or share your personal information with third parties without your consent, except as required by law or to provide essential services (e.g., payment processing)."
    },
    {
        question: "4. Data Security",
        answer: "We implement advanced security measures to protect your personal data from unauthorized access, alteration, or destruction. However, no method of data transmission is 100% secure."
    },
    {
        question: "5. Your Rights",
        answer: "You have the right to access, update, or delete your personal information. To exercise these rights, please contact us at [insert contact information]."
    },
    {
        question: "6. Cookies and Tracking",
        answer: "We use cookies and similar technologies to track usage and enhance your experience. You can manage your cookie preferences in your browser settings."
    },
    {
        question: "7. Third-Party Services",
        answer: "NenoPress may include links to third-party services. We are not responsible for the privacy practices of these external sites."
    },
    {
        question: "8. Changes to the Privacy Policy",
        answer: "We reserve the right to update this Privacy Policy at any time. Significant changes will be communicated via email or through our platform."
    },
    {
        question: "9. Contact Us",
        answer: "If you have questions about this Privacy Policy, please contact us at [insert contact information]."
    }
];
