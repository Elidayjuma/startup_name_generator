import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

export async function convertToSearchablePhrase(heading: string): Promise<string> {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: `Convert the following heading into a concise, searchable phrase for Google. 
                    Make it 4 words or less.
                    Focus on the main keywords and make it SEO-friendly while retaining the essence of the heading:\n\n"${heading}"`,
                },
            ],
            max_tokens: 30,
        });
        const searchablePhrase = (response.choices[0].message?.content ?? "").trim();
        return searchablePhrase;
    } catch (error) {
        console.error("Error generating searchable phrase:", error);
        throw error;
    }
}