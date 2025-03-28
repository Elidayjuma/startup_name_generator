"use server";

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


