import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import MySites from "@/components/Tables/MySites";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Next.js Settings | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Settings page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const Sites = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="My Sites" />
      <div className="flex flex-col gap-10">
        {/* <MySites /> */}
      </div>
    </DefaultLayout>
  );
};

export default Sites;
