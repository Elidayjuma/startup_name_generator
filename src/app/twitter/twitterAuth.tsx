"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { returnTwitterToken } from "@/actions/actions";


const TwitterAuth = () => {
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
    type TwitterObject = {
        id: number;
        accesstoken: string | null;
        accesssecret: string | null;
    }
    const [twitterTokens, setTwitterTokens] = useState<TwitterObject | null>(null);
    const [linkedInUserAccount, setLinkedInUserAccount] = useState<LinkedInUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTwitterData = async () => {
            const storedAccount = await returnTwitterToken();
            setTwitterTokens(storedAccount ?? null);
            // if (storedAccount) {
            //     const linkedinUser = await returnLinkedInUser();
            //     setLinkedInUserAccount(linkedinUser ?? null);
            // }
        };
        setLoading(false);
        fetchTwitterData(); // Call the async function inside useEffect
    }, []);


    const handleConnectTwitter = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/aouth/twitter');
            const data = await response.json();
            console.log(data)
            if (data.url) {
                window.location.href = data.url; // Redirect user to Twitter
            }
        } catch (error) {
            console.error('Login failed', error);
        }
        setLoading(false);
    };

    return (
        <div className="mb-6">
            {twitterTokens?.accesstoken ? (
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
                                onClick={handleConnectTwitter}
                                className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                            >
                                {loading ? 'Redirecting...' : 'Login with Twitter'}
                            </button>
                        </div>

                    )}

                </div>
            )}
        </div>
    );
};

export default TwitterAuth;
