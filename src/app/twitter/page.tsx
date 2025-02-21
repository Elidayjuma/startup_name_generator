"use client"
import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import InputText from "./inputText";
import TweetsDisplay from "./tweetsDisplay";
import TwitterAuth from "./twitterAuth";

const Sites = () => {
  const [tweets, setTweets] = useState<string[]>([]);

  const handleFormSubmit = (newTweets: string[]) => {
    setTweets(newTweets);


  };
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Twitter" />
      <TwitterAuth />
      <div className="flex flex-col gap-10">
        <InputText onFormSubmit={handleFormSubmit} />
        <>The tweets will be displayed here</>
        <TweetsDisplay tweets={tweets} />
      </div>
    </DefaultLayout>
  );
};

export default Sites;
