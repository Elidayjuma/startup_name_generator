import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

export async function generateHeading(format: string, prompt: string): Promise<string> {
    console.log("Generating heading from prompt:");
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "user", content: `Generate a catchy heading for a blog post about: ${prompt}\n\n
            Dont add a year to the heading.` }
        ],
        max_tokens: 100,
    });
    const heading: string  = response.choices[0].message?.content ?? "";
    return heading;
}