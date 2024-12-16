import {
    FaceSmileIcon,
    ChartBarSquareIcon,
    CursorArrowRaysIcon,
    DevicePhoneMobileIcon,
    AdjustmentsHorizontalIcon,
    SunIcon,
} from "@heroicons/react/24/solid";

import benefitOneImg from "../../../public/images/benefit-one.png";
import benefitTwoImg from "../../../public/images/benefit-two.png";

const benefitOne = {
    title: "Streamline Your Blogging Process",
    desc: "Simplify your content creation and publishing workflow with NenoPress. Here's how our features make blogging effortless:",
    image: benefitOneImg,
    bullets: [
        {
            title: "Effortless Content Creation",
            desc: "Leverage AI tools to generate SEO-optimized, high-quality blog content in minutes.",
            icon: <FaceSmileIcon />,
        },
        {
            title: "Seamless Publishing",
            desc: "Automatically schedule and publish posts to your blog with no technical expertise required.",
            icon: <ChartBarSquareIcon />,
        },
        {
            title: "Enhanced SEO Optimization",
            desc: "Get keyword suggestions and boost your blog's visibility in search engines.",
            icon: <CursorArrowRaysIcon />,
        },
    ],
};

const benefitTwo = {
    title: "Achieve More with NenoPress",
    desc: "Our additional features empower you to grow your audience and simplify your blogging experience:",
    image: benefitTwoImg,
    bullets: [
        {
            title: "Save Time, Grow Faster",
            desc: "Automate tedious tasks and focus on scaling your blog effortlessly.",
            icon: <DevicePhoneMobileIcon />,
        },
        {
            title: "Affordable & Flexible Pricing",
            desc: "Choose between our $5 or $10 plans to match your blogging needs.",
            icon: <AdjustmentsHorizontalIcon />,
        },
        {
            title: "User-Friendly Interface",
            desc: "Navigate and manage your content with ease, thanks to our intuitive design.",
            icon: <SunIcon />,
        },
    ],
};



export { benefitOne, benefitTwo };