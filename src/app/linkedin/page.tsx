"use client";
import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import InputText from "./inputText";
import PostsDisplay from "./postsDisplay";
import LinkedInAuth from "./linkedInAuth";

const LinkedIn = () => {
  const [post, setPost] = useState<string | "">("");

  const handleFormSubmit = (newPost: string | "") => {
    setPost(newPost);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="LinkedIn" />
      <LinkedInAuth />
      <div className="flex flex-col gap-10">
        <InputText onFormSubmit={handleFormSubmit} />
        <>The post will be displayed here</>
        {post ? <PostsDisplay post={post} /> : null}
      </div>
    </DefaultLayout>
  );
};

export default LinkedIn;
