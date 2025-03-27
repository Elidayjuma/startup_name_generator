import { FaGlobe, FaUsers, FaRocket } from "react-icons/fa";

const FeatureCards = () => {
    const features = [
        {
            icon: <FaGlobe className="text-blue-600 text-xl" />,
            title: "Check Domain",
            description: "Instantly verify domain availability for your startup."
        },
        {
            icon: <FaUsers className="text-green-600 text-xl" />,
            title: "Check Socials",
            description: "See if your startup name is free on social media."
        },
        {
            icon: <FaRocket className="text-red-600 text-xl" />,
            title: "AI-Powered Names",
            description: "Get unique, AI-generated names for your startup."
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-10">
            {features.map((feature, index) => (
                <div key={index} className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        {feature.icon}
                        <h3 className="text-lg font-semibold">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mt-2 text-center">{feature.description}</p>
                </div>
            ))}
        </div>
    );
};

export default FeatureCards;
