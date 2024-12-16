import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import MyPrompts from "@/components/Tables/MyPrompts";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
    title: "Next.js Settings | TailAdmin - Next.js Dashboard Template",
    description:
        "This is Next.js Settings page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const Prompts = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="My Prompts" />
            <div className="flex flex-col gap-10">
                <MyPrompts />
            </div>
        </DefaultLayout>
    );
};

export default Prompts;
