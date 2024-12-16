import Image from "next/image";
import React from "react";
import { Container } from "@/components/LandingPage/Container";

import userOneImg from "../../../public/images/user/user.webp";
import userTwoImg from "../../../public/images/user/user-02.png";
import userThreeImg from "../../../public/images/user/user.webp";

export const Testimonials = () => {
    return (
        <Container>
            <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-3">
                <div className="lg:col-span-2 xl:col-auto">
                    <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-14 rounded-2xl py-14 dark:bg-trueGray-800">
                        <p className="text-2xl leading-normal ">
                            NenoPress has made <Mark>content creation so easy</Mark>! I no longer spend hours brainstorming ideas;
                            the automated tools do it for me, and the publishing process is seamless.
                        </p>

                        <Avatar
                            image={userOneImg}
                            name="Sarah Steiner"
                            title="Blogger and content creator"
                        />
                    </div>
                </div>
                <div className="">
                    <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-14 rounded-2xl py-14 dark:bg-trueGray-800">
                        <p className="text-2xl leading-normal ">
                            With NenoPress, I’ve taken my blog to the next level.
                            <Mark>The automatic content generation</Mark> and easy publishing have saved me so much time,
                            letting me focus on growing my audience."
                        </p>

                        <Avatar
                            image={userTwoImg}
                            name="Dylan Ambrose"
                            title="Lead marketer"
                        />
                    </div>
                </div>
                <div className="">
                    <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-14 rounded-2xl py-14 dark:bg-trueGray-800">
                        <p className="text-2xl leading-normal ">
                            NenoPress saved me hours every week.
                            Its <Mark>simple interface and content automation</Mark> took the stress out of blogging,
                            allowing me to focus more on creativity!"
                        </p>

                        <Avatar
                            image={userThreeImg}
                            name="Gabrielle Winn"
                            title="Sole enterprenuer"
                        />
                    </div>
                </div>
            </div>
        </Container>
    );
};

interface AvatarProps {
    image: any;
    name: string;
    title: string;
}

function Avatar(props: Readonly<AvatarProps>) {
    return (
        <div className="flex items-center mt-8 space-x-3">
            <div className="flex-shrink-0 overflow-hidden rounded-full w-14 h-14">
                <Image
                    src={props.image}
                    width="40"
                    height="40"
                    alt="Avatar"
                    placeholder="blur"
                />
            </div>
            <div>
                <div className="text-lg font-medium">{props.name}</div>
                <div className="text-gray-600 dark:text-gray-400">{props.title}</div>
            </div>
        </div>
    );
}

function Mark(props: { readonly children: React.ReactNode }) {
    return (
        <>
            {" "}
            <mark className="text-indigo-800 bg-indigo-100 rounded-md ring-indigo-100 ring-4 dark:ring-indigo-900 dark:bg-indigo-900 dark:text-indigo-200">
                {props.children}
            </mark>{" "}
        </>
    );
}