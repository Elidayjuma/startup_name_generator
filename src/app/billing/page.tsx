"use client"
import { useState, useEffect } from "react";
import Billing from "@/components/Billing/Billing";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { returnUserSubscription, returnLogedIUser } from "@/actions/actions";

export default function Home() {
    interface Subscription {
        id: number;
        userId: number;
        packageId: number;
        startDate: Date;
        endDate: Date;
        statusId: number;
        monthlyUsage: number;
    }
    interface UsageData {
        userId: number,
        subscriptionId: number,
    }
    interface User {
        email: string
    }

    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [usage_Data, setSubscriptionUsageData] = useState<UsageData | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscription = async () => {

            let usageData: UsageData = { userId: 0, subscriptionId: 0 };
            let userData: User = { email: "" };

            const data = await returnUserSubscription();
            const logedUser = await returnLogedIUser();

            userData.email = logedUser?.email || "";
            usageData.userId = data?.userId || 0;
            usageData.subscriptionId = data?.id || 0;

            setSubscriptionUsageData(usageData)
            setSubscription(data);
            setUser(userData);
            setLoading(false);
        };
        fetchSubscription();
    }, []);

    return (
        <>
            <DefaultLayout>

                {!loading ? (
                    <Billing subscription={subscription} usage_Data={usage_Data} user={user} />
                ) : (
                    <div>Loading...</div>
                )}
            </DefaultLayout>
        </>
    );
}


