import puppeteer from "puppeteer";
import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

export async function summarizeArticles(articles: any[]): Promise<string> {
    console.log("Summarizing articles:");
    const summaries = [];
    const browser = await puppeteer.launch({ headless: true });
    
    for (const article of articles) {
        console.log(`Processing article: ${article.link}`);
        const page = await browser.newPage();
        try {
            await page.goto(article.link, { waitUntil: "networkidle2", timeout: 60000 });
            const htmlContent = await page.content();
            
            const chunks = chunkText(htmlContent, 5000);
            const chunkSummaries = await summarizeChunks(chunks);
            
            summaries.push(`- **${article.title}**: ${chunkSummaries.join(' ')}`);
        } catch (error) {
            console.error(`Failed to process article: ${article.link}`, error);
            summaries.push(`- **${article.title}**: Failed to retrieve content or summarize.`);
        } finally {
            await page.close();
        }
    }
    
    await browser.close();
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
                    { role: "user", content: `Summarize the following content for a blog post:\n\n${chunk}\n\n
                    Do NOT pick any form of branding from the  site content unless it is contributing to the blog` }
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
