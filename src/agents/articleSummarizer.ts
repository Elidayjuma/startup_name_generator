import axios from "axios";
import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

export async function summarizeArticles(articles: any[]): Promise<string> {
    const summaries = [];
    for (const article of articles) {
        try {
            const response = await axios.get(article.link, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                },
            });
            const htmlContent = response.data;
            const chunks = chunkText(htmlContent, 5000);
            const chunkSummaries = await summarizeChunks(chunks);
            summaries.push(`- **${article.title}**: ${chunkSummaries.join(' ')}`);
        } catch (error) {
            console.error(`Failed to process article: ${article.link}`, error);
            summaries.push(`- **${article.title}**: Failed to retrieve content or summarize.`);
        }
    }
    return summaries.join("\n");
}

const chunkText = (text: string, chunkSize: number) => {
    const maxChunks = 2;
    const chunks = [];
    for (let i = 0; i < text.length && chunks.length < maxChunks; i += chunkSize) {
        chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
};

const summarizeChunks = async (chunks: string[]) => {
    const summaries = [];
    for (const chunk of chunks) {
        try {
            const summaryResponse = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "user", content: `Summarize the following content for a blog post:\n\n${chunk}` }
                ],
                max_tokens: 500,
            });
            const summary = summaryResponse.choices[0].message?.content;
            summaries.push(summary);
        } catch (error) {
            console.error("Error summarizing chunk:", error);
            summaries.push("Error summarizing this portion of the text.");
        }
    }
    return summaries;
};