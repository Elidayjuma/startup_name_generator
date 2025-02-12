import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

export async function generateContentForOutline(outline: string, summaries: string): Promise<string> {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "user", content: `Generate content for each section in the following blog outline:\n\n${outline}, 
            use this for more context: \n\n${summaries}` }
        ],
        max_tokens: 5000,
    });
    const content: string = response.choices[0].message?.content ?? "";
    return content;
}