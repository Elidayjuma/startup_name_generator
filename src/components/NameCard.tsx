import React, { useState } from 'react';
import { checkSocialAvailability } from "@/actions/actions";
import SocialCheckModal from "./SocialCheckModal";

interface NameCardProps {
    name: string;
}

const NameCard: React.FC<NameCardProps> = ({ name }) => {
    const domainUrl = `https://www.namecheap.com/domains/registration/results/?domain=${name.replace(/\s+/g, "").toLowerCase()}`;

    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [socialResults, setSocialResults] = useState<{ name: string; available: boolean; url: string }[]>([]);

    const handleCheckSocials = async () => {
        setModalOpen(true);
        setIsLoading(true);
        const results = await checkSocialAvailability(name.replace(/\s+/g, "").toLowerCase());
        setSocialResults(results);
        setIsLoading(false);
    };

    return (
        <div className="bg-gray-100 hover:bg-gray-400 dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h4>
            <div className="mt-2 flex flex-col gap-2">
                <a
                    href={domainUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 px-4 py-2 rounded hover:underline inline-block text-center"
                >
                    Check Domain Availability
                </a>
                <button
                    onClick={handleCheckSocials}
                    className="px-4 py-2 rounded hover:bg-green-100 hover:underline"
                >
                    Check Socials Availability
                </button>
            </div>
            <SocialCheckModal isLoading={isLoading} isOpen={isModalOpen} onClose={() => setModalOpen(false)} results={socialResults} />
        </div>
    );
};

export default NameCard;
