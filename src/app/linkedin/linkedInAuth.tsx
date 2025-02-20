"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { returnLinkedInToken, returnLinkedInUser } from "@/actions/actions";

const CLIENT_ID = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
const REDIRECT_URI = process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI;

const LinkedInAuth = () => {
    type LinkedInUser = {
        id: number;
        userId: number;
        name: string | null;
        linkedin_id: string;
        given_name: string | null;
        family_name: string | null;
        picture: string | null;
        locale: string | null;
        email: string | null;
        email_verified: boolean;
    };
    const [linkedInTokens, setLinkedInTokens] = useState<object | null>(null);
    const [linkedInUserAccount, setLinkedInUserAccount] = useState<LinkedInUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchLinkedInData = async () => {
            const storedAccount = await returnLinkedInToken();
            if (storedAccount) {
                const linkedinUser = await returnLinkedInUser();
                setLinkedInUserAccount(linkedinUser ?? null);
                setLinkedInTokens(storedAccount);
            }
        };
        setLoading(false);
        fetchLinkedInData(); // Call the async function inside useEffect
    }, []);


    const handleConnectLinkedIn = () => {
        // Redirect user to LinkedIn OAuth login (Replace with actual login URL)
        window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&state=initial&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=openid%20profile%20email%20w_member_social`;
    };

    return (
        <div className="mb-6">
            {linkedInTokens ? (
                <div className="text-lg font-semibold text-green-600">
                    {loading ? (
                        <div >
                            Loading...
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            ✅ Connected Account: {linkedInUserAccount?.name}
                            <div className="h-14 w-14 rounded-full overflow-hidden">
                                <Image
                                    src={"/images/user/user.webp"}
                                    width={55}
                                    height={55}
                                    alt="User"
                                />
                            </div>
                        </div>

                    )}
                </div>
            ) : (
                <div className="text-lg text-red-500">
                    {loading ? (
                        <div >
                            Loading...
                        </div>
                    ) : (
                        <div>
                            ❌ No Account Connected
                            <button
                                onClick={handleConnectLinkedIn}
                                className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                            >
                                Connect Account
                            </button>
                        </div>

                    )}

                </div>
            )}
        </div>
    );
};

export default LinkedInAuth;
