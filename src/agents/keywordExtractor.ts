import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

export async function extractKeywords(prompt: string): Promise<string[]> {
    console.log("Extracting keywords from prompt:", prompt);
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "user", content: `Extract keywords from the following prompt: ${prompt}` }
        ],
        max_tokens: 100,
    });
    const keywords = (response.choices[0].message?.content ?? "").split(", ");
    return keywords;
}