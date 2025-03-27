import React from 'react';

import SearchForm from './SearchForm';

import { heroDetails } from '@/data/hero';

const Hero: React.FC = () => {
    return (
        <section
            id="hero"
            className="relative flex items-center justify-center pb-0 pt-32 md:pt-40 px-5 min-h-[80vh]"
        >
            <div className="absolute left-0 top-0 bottom-0 -z-10 w-full">
                <div className="absolute inset-0 h-full w-full bg-hero-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]">
                </div>
            </div>

            <div className="absolute left-0 right-0 bottom-0 backdrop-blur-[2px] h-40 bg-gradient-to-b from-transparent via-[rgba(233,238,255,0.5)] to-[rgba(202,208,230,0.5)]">
            </div>

            <div className="text-center w-[80vw] mx-auto">
                <h1 className="text-4xl md:text-6xl md:leading-tight font-bold text-foreground">{heroDetails.heading}</h1>
                <p className="mt-4 text-foreground ">{heroDetails.subheading}</p>
                <div className="mt-6 mb-60 sm:gap-4">

                    <SearchForm />
                </div>

            </div>
        </section>
    );
};

export default Hero;
