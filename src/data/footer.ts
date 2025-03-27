import { IMenuItem, ISocials } from "@/types";

export const footerDetails: {
    subheading: string;
    quickLinks: IMenuItem[];
    email: string;
    telephone: string;
    socials: ISocials;
} = {
    subheading: "Empowering businesses with names beyond imagination.",
    quickLinks: [
        {
            text: "Domains",
            url: "https://elidayjuma.com/tag/domain-names/"
        },
        {
            text: "Startups",
            url: "https://elidayjuma.com/tag/domain-names/"
        },
        {
            text: "Ideas",
            url: "https://elidayjuma.com/50-one-page-website-ideas-with-traffic-revenue-potential/"
        }
    ],
    email: 'elidayjuma@gmail.com',
    telephone: 'not today',
    socials: {
        // github: 'https://github.com',
        // x: 'https://twitter.com/x',
        twitter: 'https://twitter.com/Twitter',
        facebook: 'https://facebook.com',
        // youtube: 'https://youtube.com',
        linkedin: 'https://www.linkedin.com',
        // threads: 'https://www.threads.net',
        instagram: 'https://www.instagram.com',
    }
}