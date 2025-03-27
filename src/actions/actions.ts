"use server";

import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from 'next/cache';
import { session_data } from "../middleware";
import {WORDPRESS_SYNTHESIZE_BLOG} from "../actions-publish/wordpress";
import {WORDPRESS_SYNTHESIZE_BLOG_WITH_AGENTS} from "../actions-publish/wordpress_agentic";
import {WORDPRESS_SYNTHESIZE_BLOG_WITH_RESEARCH} from "../actions-publish/wordpress_new";
import { GENERATE_TWEETS } from "@/actions-publish/tweets";
import { POST_A_TWEET_3RD_PARTY } from "@/actions-publish/tweets";
import {GENERATE_POST} from "@/actions-publish/post";

const axios = require("axios");

const bcrypt = require('bcrypt');

interface Site {
    site_url: string;
    wp_username: string;
    api_password: string;
}
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY! });

export async function generateNames(keyword: string): Promise<string[]> {
    if (!keyword.trim()) return []; // Ensure it always returns an array

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Generate 20 creative startup name ideas based on the keyword: "${keyword}". Return only the names as a numbered list. No extra text`,
        },
      ],
      max_tokens: 500,            
        });

        const namesArray = response.choices[0].message?.content
            ?.split("\n")
            .filter((name) => name.trim() !== "")
            .map((name) => name.replace(/^\d+\.\s*/, "").trim()) || []; // Fallback to empty array

        return namesArray;
    } catch (error) {
        console.error("Error generating names:", error);
        return []; // Always return an array
    }
}


export const checkSocialAvailability = async (username: string) => {
    const platforms = [
        { name: "Bluesky", url: `https://bsky.app/profile/${username}.bsky.social` },
        { name: "YouTube", url: `https://www.youtube.com/@${username}` },
        // { name: "Twitter", url: `https://twitter.com/${username}` },
        // { name: "Facebook", url: `https://www.facebook.com/${username}` },
        // { name: "LinkedIn", url: `https://www.linkedin.com/in/${username}` },
        // { name: "Threads", url: `https://www.threads.net/@${username}` },
        // { name: "Medium", url: `https://medium.com/@${username}` },
        // { name: "Instagram", url: `https://www.instagram.com/${username}` },
        // { name: "TikTok", url: `https://www.tiktok.com/@${username}` },
    ];

    const results = await Promise.all(
        platforms.map(async (platform) => {
            try {
                const response = await fetch(platform.url, { method: "HEAD" });
                return {
                    name: platform.name,
                    available: response.status === 404, // If 404, username is available
                    url: platform.url,
                };
            } catch {
                return { name: platform.name, available: false, url: platform.url };
            }
        })
    );

    return results;
};


export async function createUser(formData: FormData) {
    let temp_password = formData.get("password") as string;
    let mypass = bcrypt.hashSync(temp_password, 10);

    await prisma.user.create({
        data: {
            email:formData.get("email") as string,
            name: formData.get("full_name") as string,
            password: mypass,
        
        },
    });
    redirect("/auth/signin");
}

export async function returnSingleUser(email: string) {
     const user = await prisma.user.findUnique({
        where: {
            email: email
        },
    });
    return user;
}
export async function returnLogedIUser() {
    const logeduser = await session_data();
    if (!logeduser) {
        return undefined
    }

    const userId = parseInt(logeduser?.userId as string, 10);
    const user = await prisma.user.findUnique({
       where: {
           id: userId
       },
   });
   return user;
}

export async function createSite(formData: FormData) {
    const user = await session_data();
    let site_logo = formData.get("site_logo") as string
    let site_favicon = formData.get("site_favicon") as string
    
    if (!user?.userId) {
        throw new Error("User ID is required to create a site.");
    }
    const userId = parseInt(user.userId as string, 10);

    await prisma.site.create({
        data: {
            site_name: formData.get("name") as string,
            wp_username: formData.get("wp_username") as string,
            api_password: formData.get("api_password") as string,
            site_url: formData.get("site_url") as string,
            site_bio: formData.get("site_bio") as string,
            site_logo: site_logo ? site_logo : "n/a", 
            site_favicon:  site_favicon ? site_favicon : "n/a", 
            userId: userId
         }
    });
    revalidatePath('/sites')
    redirect("/sites");
}

export async function createLinkedInToken(data: any) {
    const user = await session_data();
    
    if (!user?.userId) {
        throw new Error("User ID is required to create a token record.");
    }
    const userId = parseInt(user.userId as string, 10);

    const linkedInToken = await prisma.linkedInTokens.upsert({
        where: { userId: userId }, // Ensure userId is unique in your schema
        update: {
            access_token: data.access_token as string,
            scope: data.scope as string,
            id_token: data.id_token as string,
            refresh_token: data.refresh_token as string,
            expiry: data.expires_in as Date,
            token_type: data.token_type as string, 
        },
        create: {
            userId: userId,
            access_token: data.access_token as string,
            scope: data.scope as string,
            id_token: data.id_token as string,
            refresh_token: data.refresh_token as string,
            expiry: data.expires_in as Date,
            token_type: data.token_type as string, 
        },
    });
    
    return linkedInToken
}

export async function createLinkedinUser(data: any) {
    const user = await session_data();
    
    if (!user?.userId) {
        throw new Error("User ID is required to create a linkedin user profile.");
    }
    const userId = parseInt(user.userId as string, 10);
    
 await prisma.linkedInProfiles.upsert({
        where: { linkedin_id: data.sub as string },
        update: {
            name: data.name as string,
            given_name: data.given_name as string,
            family_name: data.family_name as string,
            picture: data.picture as string,
            locale: data.locale.country as string,
            email: data.email as string,
            email_verified: data.email_verified as boolean,
            userId: userId
        },
        create: {
            linkedin_id: data.sub as string,
            name: data.name as string,
            given_name: data.given_name as string,
            family_name: data.family_name as string,
            picture: data.picture as string,
            locale: data.locale.country as string,
            email: data.email as string,
            email_verified: data.email_verified as boolean,
            userId: userId
        }
    });
}

export async function returnLinkedInToken() {
    const logeduser = await session_data();
    if (!logeduser) {
        return undefined
    }

    const userId = parseInt(logeduser?.userId as string, 10);
    const linkedInToken = await prisma.linkedInTokens.findUnique({
       where: {
           userId: userId
       },
   });
   return linkedInToken;
}

export async function returnLinkedInUser() {
    const logeduser = await session_data();
    if (!logeduser) {
        return undefined
    }

    const userId = parseInt(logeduser?.userId as string, 10);
    const linkedInUser = await prisma.linkedInProfiles.findUnique({
       where: {
           userId: userId
       },
   });
   return linkedInUser;
}

export async function createTwitterToken(data: any) {
    const user = await session_data();
    
    if (!user?.userId) {
        throw new Error("User ID is required to create a token record.");
    }
    const userId = parseInt(user.userId as string, 10);

    const twitterToken = await prisma.twitterTokens.upsert({
        where: { userId: userId }, // Ensure userId is unique in your schema
        update: {
            oauth_token_secret: data.oauth_token_secret as string,
            oauth_token: data.oauth_token as string,
            accesstoken: data.access_token as string,
            accesssecret: data.access_secret as string,
            refresh_token: data.refresh_token as string,
            expiry: data.expires_in as Date, 
        },
        create: {
            userId: userId,
            oauth_token_secret: data.oauth_token_secret as string,
            oauth_token: data.oauth_token as string,
            accesstoken: data.access_token as string,
            accesssecret: data.access_secret as string,
            refresh_token: data.refresh_token as string,
            expiry: data.expires_in as Date,  
        },
    });
    
    return twitterToken
}

export async function createTwitterUser(data: any) {
    const user = await session_data();
    
    if (!user?.userId) {
        throw new Error("User ID is required to create a linkedin user profile.");
    }
    const userId = parseInt(user.userId as string, 10);
    
 await prisma.linkedInProfiles.upsert({
        where: { linkedin_id: data.sub as string },
        update: {
            name: data.name as string,
            given_name: data.given_name as string,
            family_name: data.family_name as string,
            picture: data.picture as string,
            locale: data.locale.country as string,
            email: data.email as string,
            email_verified: data.email_verified as boolean,
            userId: userId
        },
        create: {
            linkedin_id: data.sub as string,
            name: data.name as string,
            given_name: data.given_name as string,
            family_name: data.family_name as string,
            picture: data.picture as string,
            locale: data.locale.country as string,
            email: data.email as string,
            email_verified: data.email_verified as boolean,
            userId: userId
        }
    });
}

export async function returnTwitterToken() {
    const logeduser = await session_data();
    if (!logeduser) {
        return undefined
    }

    const userId = parseInt(logeduser?.userId as string, 10);
    const twitterToken = await prisma.twitterTokens.findUnique({
       where: {
           userId: userId
       },
   });
   return twitterToken;
}


export async function shareOnLinkedIn(accessToken: string, personUrn: string, postText: string) {
    const url = "https://api.linkedin.com/v2/ugcPosts";
    const personID = `urn:li:person:${personUrn}`;

    const requestBody = {
        author: personID,
        lifecycleState: "PUBLISHED",
        specificContent: {
            "com.linkedin.ugc.ShareContent": {
                shareCommentary: {
                    text: postText,
                },
                shareMediaCategory: "NONE",
            },
        },
        visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
    };

    try {
        console.log("posting to linkedin...")
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "X-Restli-Protocol-Version": "2.0.0",
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            console.log("Post shared successfully on LinkedIn!");
            return response.json();
        } else {
            const error = await response.json();
            console.error("Failed to share post:", error);
        }
    } catch (error) {
        console.error("Error sharing post:", error);
    }
};


export async function returnUserSites () {
        const user  = await session_data();
        const userId = user?.userId ? parseInt(user.userId as string, 10) : undefined;
    const sites = await prisma.site.findMany({
        where: {
            userId: userId
        }
    })
    return sites
}

export async function returnSingleSite (id: number) {
    const site = await prisma.site.findUnique({
        where: {
            id: id
        },
    });
    return site;
}
export async function createTweets(prompt: string) {
    const user = await session_data();
    const tweets  = await GENERATE_TWEETS( prompt)
    type SubscriptionData = {
        subscriptionId?: number;
        userId?: number;
    };
    const activeSubscription = await returnUserSubscription()
    let data: SubscriptionData= {
        subscriptionId :activeSubscription?.id,
        userId : user?.userId ? parseInt(user.userId as string, 10) : undefined
    };
    await createPromptUsage(data)
    return tweets;

}

export async function publishTweet(message: string, twitterTokens: any) {
    const tweet = await POST_A_TWEET_3RD_PARTY(message, twitterTokens);
    return tweet
}

export async function createPost(prompt: string) {
    const user = await session_data();
    const post  = await GENERATE_POST( prompt)
    type SubscriptionData = {
        subscriptionId?: number;
        userId?: number;
    };
    const activeSubscription = await returnUserSubscription()
    let data: SubscriptionData= {
        subscriptionId :activeSubscription?.id,
        userId : user?.userId ? parseInt(user.userId as string, 10) : undefined
    };
    await createPromptUsage(data)
    return post;

}

export async function createPrompt(formData: FormData) {
     const user = await session_data();
     const userId = user?.userId ? parseInt(user.userId as string, 10) : undefined;
     type PromptData = {
        prompt: string;
        id: number;
        tag_id: string;
        category_id: string;
        image_status: number;
        research_option: number;
        prompt_id?: number; // Make this property optional
        subscriptionId?: number;
        userId?: number;
        research_links?: string;
    };

    let data: PromptData = {
        prompt: formData.get("prompt_message") as string,
        id: parseInt(formData.get("siteId") as string),
        tag_id: formData.get("tag_ids") as string,
        category_id: formData.get("category_ids") as string,
        image_status: parseInt(formData.get("image_status") as string),
        research_links: formData.get("research_links") as string,
        research_option : parseInt(formData.get("research_option") as string),
    };

     let status = parseInt(formData.get("status") as string);

     const prompt = await prisma.prompts.create({
        data: {
            prompt_message: formData.get("prompt_message") as string,
            status: status,
            category_ids: formData.get("category_ids") as string,
            tag_ids: formData.get("tag_ids") as string,
            image_id: formData.get("image_id") as string,
            Site: {
                connect: { id: parseInt(formData.get("siteId") as string) }, // Connect to an existing Site
              },
              User: {
                  connect: { id: userId }, // Connect to an existing User

              }
        }        
    })
    data.prompt_id = prompt.id;
    const activeSubscription = await returnUserSubscription()
    data.subscriptionId = activeSubscription?.id
    data.userId = user?.userId ? parseInt(user.userId as string, 10) : undefined;

    await createPromptUsage(data)

    status == 1 ? await WORDPRESS_SYNTHESIZE_BLOG_WITH_AGENTS(data): null;
    revalidatePath('/prompts')
    redirect("/prompts");

}

export async function createPromptUsage(useData: any) {
    await prisma.promptsUsage.create({
       data: {
            dateUsed: new Date(),
            Subscriptions: {
               connect: { id: useData.subscriptionId }, // Connect to an existing Site
             },
            User: {
                 connect: { id: useData.userId }, // Connect to an existing User

             }
       }        
   })
  

}

export async function updatePrompt  (prompt_info: any) {
    await prisma.prompts.update({
        where: {
          id: prompt_info.id,
        },
        data: {
          image_id: prompt_info.image_id as string,
        },
      })
}

export async function returnUserPromptUsage (usageData: any) {
    
const promptsUsage = await prisma.promptsUsage.findMany({
    where: {
        userId: usageData.userId,
        subscriptionId: usageData.subscriptionId
    }
})
return promptsUsage
}


export async function returnUserPrompts () {
    const user  = await session_data();
    const userId = user?.userId ? parseInt(user.userId as string, 10) : undefined;
const prompts = await prisma.prompts.findMany({
    where: {
        userId: userId
    }, 
    include: {
        Site: true,

    }
})
return prompts
}

export async function createUserSubscription (subscriptionData: any) {
    const user = await session_data();
    let userId;
    if(user) {
         userId = parseInt(user.userId as string, 10);
    } else {
        return
    }
    
    const promptPackageFeature = await prisma.packageFeatures.findFirst({
        where: {
            name: "Prompts"
        }
    })
    
    const monthlyUsageTokens = await prisma.subscriptionFeatures.findFirst({
        where: {
            subscriptionPackageId: subscriptionData.planData.id,
            packageFeatureId: promptPackageFeature?.id

        }
    })
    
    const monthlyTokenLimit = monthlyUsageTokens?.featureLimit ?? undefined;

    await prisma.subscriptions.create({
        data: {
            monthlyUsage: monthlyTokenLimit,
            startDate: new Date(),
            endDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
            User: {
                connect: {id: userId} // Connect to an existing User

            },
            SubscriptionPackages: {
                connect: { id: subscriptionData.planData.id }, // Connect to an existing Package

            },
            SubscriptionStatuses: {
                connect: { id: 2 }, // Connect to an existing Status

            }


        },
    });
    // revalidatePath('/billing')
    // redirect("/billing");
}

export async function returnUserSubscription () {

    const user  = await session_data();

    const userId = user?.userId ? parseInt(user.userId as string, 10) : undefined;
    
    const subscription = await prisma.subscriptions.findFirst({
        where: {
            userId: userId,
            statusId: 2
        }
        
    })
    if(!subscription) {
        console.log("in actions", "subscription not found")
        return null
    }

    return subscription
}

export async function getWordpressSiteCategories (site: Site) {
    const wordpressUrl = `${site.site_url}/wp-json/wp/v2/categories`;
    const auth = {
        username: site.wp_username,
        password: site.api_password,
    };

    const response = await axios.get(wordpressUrl, { auth });
    const categories= response.data;
    return categories;
}

export async function getWordpressSiteTags (site: Site) {
    const wordpressUrl = `${site.site_url}/wp-json/wp/v2/tags`;
    const auth = {
        username: site.wp_username,
        password: site.api_password,
    };

    const response = await axios.get(wordpressUrl, { auth });
    const tags= response.data;
    return tags;
}






        
       


