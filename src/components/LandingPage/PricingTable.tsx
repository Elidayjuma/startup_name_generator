"use client";
import { useState } from "react";
import { Container } from "@/components/LandingPage/Container";;
import ConfirmBillModal from "@/components/Modals/ConfirmBillModal";

interface PricingTableProps {
    subscription?: any; // Replace `any` with the specific type of `subscription`
    user?: any;
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

const PricingTable: React.FC<PricingTableProps> = ({ subscription, user }) => {

    const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);
    const [selectPlan, setSelectPlan] = useState<any>(null); // Track which plan is loading
    const [isModalOpen, setIsModalOpen] = useState(false);



    const handleButtonClick = async (plan: any) => {
        try {
            setSelectPlan(plan);
            setIsModalOpen(!isModalOpen)
            setLoadingPlanId(plan.id); // Set the loading state for the clicked plan
            // const logedUser = await returnLogedIUser();
            if (user === undefined) {
                alert("Signin/Signup to subscribe")
                return
            }

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
            <ConfirmBillModal
                user={user}
                plan={selectPlan}
                open={isModalOpen}
                setIsModalOpen={(value: boolean) => (setIsModalOpen(value))} />
        </Container>
    );
};

export default PricingTable;
