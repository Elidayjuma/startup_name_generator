import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

export async function prePromptReviewer(prompt: string): Promise<{ format: string, refinedPrompt: string }> {
    try {
        // Step 1: Determine the blog format (list or flowing article)
        const formatResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: `The user wants to write a blog post with the following prompt: "${prompt}". 
                    Determine whether this article is best structured as a resource list or as a flowing article. 
                    Respond with a single word: "list" if it should be a list or "article" if it should be a flowing article.`,
                },
            ],
            max_tokens: 10,
        });

        const format = (formatResponse.choices[0].message?.content ?? "").trim().toLowerCase();

        // Step 2: Generate a world-class prompt based on the format
        const promptResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: `Rewrite the following blog prompt into a world-class prompt suitable for generating a high-quality article. 
                    Ensure it is detailed, well-structured, and optimized for an LLM to generate expert-level content.
                    Original Prompt: "${prompt}"`,
                },
            ],
            max_tokens: 300,
        });

        const refinedPrompt = (promptResponse.choices[0].message?.content ?? "").trim();

        return { format, refinedPrompt };
    } catch (error) {
        console.error("Error determining blog format and generating prompt:", error);
        throw error;
    }
}
