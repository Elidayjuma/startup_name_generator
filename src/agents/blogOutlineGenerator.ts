import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

export async function generateBlogOutlineAndFAQs(summaries: string): Promise<{ outline: string, faqs: string }> {
    console.log("Generating blog outline and FAQs:");
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "user", content: `Generate a well structured blog outline and include FAQs based on the following:\n\n"${summaries}"
            The outline must put SEO best practices in mind and the FAQs must contribute to the blog SEO.` }
        ],
        max_tokens: 1000,
    });
    const content: string = response.choices[0].message?.content ?? "";
    const outline = content.split("FAQs:")[0];
    const faqs = content.split("FAQs:")[1];
    return { outline, faqs };
}