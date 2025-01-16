"use client";
import { useState } from "react";
import { redirect } from "next/navigation";
import { Container } from "@/components/LandingPage/Container";
import { createUserSubscription, returnLogedIUser } from "@/actions/actions";
import { usePaystackPayment } from 'react-paystack';

interface PricingTableProps {
    subscription?: any; // Replace `any` with the specific type of `subscription`
}

const plans = [
    {
        name: "Basic",
        id: 1,
        price: 500,
        paystackPrice: 50000,
        features: [
            "Generate up to 20 blog posts per month",
            "Publish directly to one blog site",
            "Customer support",
        ],
        colorClass: "text-blue-600",
        buttonClass: "bg-blue-600",
        hoverClass: "bg-blue-700",
        isHighlighted: false,
        paystackPlanId: "PLN_uaox2yea9vtqzow"
    },
    {
        name: "Advanced",
        id: 2,
        price: 1000,
        paystackPrice: 100000,
        features: [
            "Generate up to 50 blog posts per month",
            "Publish directly to two blog sites",
            "Priority customer support",
        ],
        colorClass: "text-yellow-500",
        buttonClass: "bg-yellow-500",
        hoverClass: "bg-yellow-600",
        isHighlighted: true,
        paystackPlanId: "PLN_zd2mwuoa08idgry"
    },
    {
        name: "Premium",
        id: 3,
        price: 10000,
        paystackPrice: 1000000,
        features: [
            "Generate up to 350 blog posts per month",
            "Publish directly to unlimited blog sites",
            "Dedicated account manager",
        ],
        colorClass: "text-green-600",
        buttonClass: "bg-green-600",
        hoverClass: "bg-green-700",
        isHighlighted: false,
        paystackPlanId: "PLN_64zym6x3hbv4vtl"
    },
];

const PricingTable: React.FC<PricingTableProps> = ({ subscription }) => {

    const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);
    const [selectPlan, setSelectPlan] = useState<any>(null); // Track which plan is loading
    // you can call this function anything
    const onSuccess = (reference: any) => {
        // Implementation for whatever you want to do with reference and after success call.

        createUserSubscription({ planData: selectPlan });
    };

    // you can call this function anything
    const onClose = () => {
        // implementation for  whatever you want to do when the Paystack dialog closed.
        console.log('closed')

    }

    const handleButtonClick = async (plan: any) => {

        try {
            setLoadingPlanId(plan.id); // Set the loading state for the clicked plan
            setSelectPlan(plan)
            const logedUser = await returnLogedIUser();
            if (logedUser === undefined) {
                alert("Signin/Signup to subscribe")
                return

            }
            const config = {
                reference: (new Date()).getTime().toString(),
                email: logedUser?.email,
                amount: plan.paystackPrice, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
                publicKey: "pk_test_4d73290887e91f8cba2337cd11986fbea0328a4c",
                currency: "KES",
                plan: plan.paystackPlanId
            };
            const initializePayment = usePaystackPayment(config);
            initializePayment({ onSuccess, onClose })


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
                            <p className={`text-2xl font-bold mb-6 ${plan.colorClass}`}>
                                KES{plan.price}/month
                            </p>
                            <ul className="text-gray-700 space-y-4 mb-6">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx}>{feature}</li>
                                ))}
                            </ul>
                            {subscription?.packageId ?
                                <button
                                    className={`${plan.buttonClass} text-white py-2 px-4 rounded-full hover:${plan.hoverClass} ${loadingPlanId === plan.id ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                    onClick={() => alert("You have an active subscription")}
                                    disabled={loadingPlanId === plan.id} // Disable the button if the plan is loading
                                >
                                    {loadingPlanId === plan.id
                                        ? "Processing..."
                                        : plan.id === subscription?.packageId
                                            ? "Active Plan"
                                            : "Buy Now"}
                                </button>
                                :
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
                            }
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    );
};

export default PricingTable;
