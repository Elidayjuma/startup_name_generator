import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

export async function generateImage(prompt: string) {
    try {
        const imagePrompt = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: `Generate an image prompt from this prompt to be used in a blog post: ${prompt}`,
                },
            ],
            max_tokens: 100,
        });
        const img_prompt = imagePrompt.choices[0].message?.content;
        const response = await openai.images.generate({
            model: "dall-e-2",
            prompt: `Generate an image for a blog post. This is the image promt: ${img_prompt}`,
        });

        // Assuming response.data contains the image URL(s)
        const imageUrl = response.data[0].url; // Adjust based on actual response structure

        return imageUrl;
    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
}