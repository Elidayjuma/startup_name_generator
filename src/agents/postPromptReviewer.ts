import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

export async function postPromptReviewer(heading: string, content: string): Promise<{ isAligned: boolean, seoScore: number, feedback: string }> {
    try {
        // Step 1: Check if the content aligns with the heading
        const alignmentResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: `Review the following blog post content to ensure it is aligned with the heading.
                    Respond with "yes" if the content aligns with the heading and "no" if it does not.
                    
                    Heading: "${heading}"
                    Content: "${content}"`,
                },
            ],
            max_tokens: 10,
        });

        const isAligned = alignmentResponse.choices[0].message?.content?.trim().toLowerCase() === "yes";

        // Step 2: Evaluate SEO-friendliness (on a scale of 0-100)
        const seoResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: `Analyze the SEO-friendliness of the following blog post on a scale of 0-100.
                    Consider keyword usage, readability, structure, and meta descriptions.
                    Return a single number as the score.
                    
                    Content: "${content}"`,
                },
            ],
            max_tokens: 10,
        });

        const seoScore = parseInt(seoResponse.choices[0].message?.content?.trim() || "50", 10);
        console.log("SEO Score:", seoScore);

        // Step 3: Provide feedback for improvements
        const feedbackResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: `Provide concise feedback on how to improve the following blog post for better alignment with the heading and SEO.
                    
                    Heading: "${heading}"
                    Content: "${content}"`,
                },
            ],
            max_tokens: 200,
        });

        const feedback = feedbackResponse.choices[0].message?.content?.trim() || "No specific feedback available.";

        return { isAligned, seoScore, feedback };
    } catch (error) {
        console.error("Error during post-prompt review:", error);
        throw error;
    }
}
