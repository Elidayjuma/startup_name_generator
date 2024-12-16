"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/LandingPage/Container";
import { createUserSubscription } from "@/actions/actions";

interface PricingTableProps {
    subscription?: any; // Replace `any` with the specific type of `subscription`
}

const plans = [
    {
        name: "Basic",
        id: 1,
        price: 5,
        features: [
            "Generate up to 20 blog posts per month",
            "Publish directly to one blog site",
            "Customer support",
        ],
        colorClass: "text-blue-600",
        buttonClass: "bg-blue-600",
        hoverClass: "bg-blue-700",
        isHighlighted: false,
    },
    {
        name: "Advanced",
        id: 2,
        price: 10,
        features: [
            "Generate up to 50 blog posts per month",
            "Publish directly to two blog sites",
            "Priority customer support",
        ],
        colorClass: "text-yellow-500",
        buttonClass: "bg-yellow-500",
        hoverClass: "bg-yellow-600",
        isHighlighted: true,
    },
    {
        name: "Premium",
        id: 3,
        price: 100,
        features: [
            "Generate up to 350 blog posts per month",
            "Publish directly to unlimited blog sites",
            "Dedicated account manager",
        ],
        colorClass: "text-green-600",
        buttonClass: "bg-green-600",
        hoverClass: "bg-green-700",
        isHighlighted: false,
    },
];

const PricingTable: React.FC<PricingTableProps> = ({ subscription }) => {
    const router = useRouter();
    const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null); // Track which plan is loading

    const handleButtonClick = async (plan: any) => {
        setLoadingPlanId(plan.id); // Set the loading state for the clicked plan
        try {
            await createUserSubscription({ planData: plan });

        } catch (error) {
            console.error("Error creating subscription:", error);
        } finally {
            setLoadingPlanId(null); // Reset loading state
        }
    };

    return (
        <Container className="flex flex-wrap mb-20 lg:gap-10 lg:flex-nowrap">
            <div className="w-full max-w-6xl mx-auto py-2 px-2">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`bg-white rounded-lg shadow-lg p-6 text-center ${plan.id === subscription?.packageId ? "border-2 border-yellow-500" : ""
                                }`}
                        >
                            <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                            <p className={`text-4xl font-bold mb-6 ${plan.colorClass}`}>
                                ${plan.price}/month
                            </p>
                            <ul className="text-gray-700 space-y-4 mb-6">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx}>{feature}</li>
                                ))}
                            </ul>
                            <button
                                className={`${plan.buttonClass} text-white py-2 px-4 rounded-full hover:${plan.hoverClass} ${loadingPlanId === plan.id ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                onClick={() => handleButtonClick(plan)}
                                disabled={loadingPlanId === plan.id} // Disable the button if the plan is loading
                            >
                                {loadingPlanId === plan.id
                                    ? "Processing..."
                                    : plan.id === subscription?.packageId
                                        ? "Active Plan"
                                        : "Buy Now"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    );
};

export default PricingTable;
