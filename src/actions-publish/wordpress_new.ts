const axios = require("axios");
const { OpenAI } = require("openai");
const marked = require("marked");
const { updatePrompt, returnSingleSite } = require("@/actions/actions");

// OpenAI configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

// Google Custom Search API configuration
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;

type PromptData = {
    prompt: string,
    id: number,
    category_id: string,
    tag_id: string,
    image_status: number,
    prompt_id?: number,
    research_links?: string,
}

// Function to create and publish the post
export const WORDPRESS_SYNTHESIZE_BLOG_WITH_RESEARCH = async (data: PromptData) => {
    const prompt = data.prompt;
    const site = await returnSingleSite(data.id);

    try {
        // Extract keywords from the prompt
        const keywords = await extractKeywords(prompt);

        // Generate a heading from the prompt
        const heading = await generateHeading(prompt);

        //Convert heading to searchable phrase
        const searchablePhrase = await convertToSearchablePhrase(heading);

        // Search on Google for the generated header
        const searchResults = await searchGoogle(searchablePhrase);

        // Take the top 3 articles and summarize them
        const summaries = await summarizeArticles(searchResults);

        // Generate a structured blog outline and include FAQs
        const { outline, faqs } = await generateBlogOutlineAndFAQs(summaries);

        // Generate content for each section in the blog outline
        const content = await generateContentForOutline(outline);

        // Combine the content into one
        const fullContent = combineContent(content, faqs);

        // Initialize featured image ID
        let featuredImageId = null;

        // Generate and upload image if enabled
        if (data.image_status === 1) {
            const imageUrl = await generateImage(prompt);
            featuredImageId = await uploadImageToWordPress(imageUrl, site);
        }

        // Parse and format content
        const formattedContent = formatContentForWordPress(fullContent);

        // Publish the post on WordPress
        const response = await publishToWordPress(
            heading,
            formattedContent,
            site,
            data,
            featuredImageId
        );

        let prompt_info = {
            id: data.prompt_id,
            image_id: featuredImageId,
        };
        await updatePrompt(prompt_info);

        return { success: true, title: heading, postUrl: response.link };
    } catch (error) {
        console.error("Error during the blog synthesis process:", error);
        throw error;
    }
};

// Function to extract keywords from the prompt
async function extractKeywords(prompt: string): Promise<string[]> {
    console.log("Extracting keywords from prompt:", prompt);
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "user", content: `Extract keywords from the following prompt: ${prompt}` }
        ],
        max_tokens: 100,
    });
    const keywords = response.choices[0].message?.content.split(", ");
    return keywords;
}

// Function to generate a heading from the prompt
async function generateHeading(prompt: string): Promise<string> {
    console.log("Generating heading from prompt:");
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "user", content: `Generate a catchy heading for a blog post about: ${prompt}` }
        ],
        max_tokens: 100,
    });
    const heading = response.choices[0].message?.content;
    return heading;
}

// Function to convert a heading into a searchable phrase
async function convertToSearchablePhrase(heading: string): Promise<string> {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Use the appropriate OpenAI model
            messages: [
                {
                    role: "user",
                    content: `Convert the following heading into a concise, searchable phrase for Google. Focus on the main keywords and make it SEO-friendly while retaining the essence of the heading:\n\n"${heading}"`,
                },
            ],
            max_tokens: 30, // Allow enough tokens for a concise phrase
        });

        // Extract the generated searchable phrase
        const searchablePhrase = response.choices[0].message?.content.trim();

        return searchablePhrase;
    } catch (error) {
        console.error("Error generating searchable phrase:", error);
        throw error;
    }
}

// Function to search on Google for the generated header
async function searchGoogle(query: string): Promise<any[]> {
    console.log("Searching Google for:", query);
    const url = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${GOOGLE_API_KEY}&cx=${GOOGLE_CSE_ID}`;
    const response = await axios.get(url);
    console.log(response.data)
    const items = response.data.items;
    console.log(items)
    // Filter out sponsored results
    const filteredItems = items.filter((item: any) => !item.link.includes('ad'));
    return filteredItems.slice(0, 3);
}

// Function to summarize articles
async function summarizeArticles(articles: any[]): Promise<string> {
    console.log("Summarizing articles:");
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

// Function to generate a structured blog outline and include FAQs
async function generateBlogOutlineAndFAQs(summaries: string): Promise<{ outline: string, faqs: string }> {
    console.log("Generating blog outline and FAQs:");
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "user", content: `Generate a structured blog outline and include FAQs based on the following summaries:\n\n${summaries}` }
        ],
        max_tokens: 1000,
    });
    const content = response.choices[0].message?.content;
    const outline = content.split("FAQs:")[0];
    const faqs = content.split("FAQs:")[1];
    return { outline, faqs };
}

// Function to generate content for each section in the blog outline
async function generateContentForOutline(outline: string): Promise<string> {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "user", content: `Generate content for each section in the following blog outline:\n\n${outline}` }
        ],
        max_tokens: 5000,
    });
    const content = response.choices[0].message?.content;
    return content;
}

// Function to combine the content into one
function combineContent(content: string, faqs: string): string {
    return `${content}\n\nFAQs:\n${faqs}`;
}

// Function to process research links
async function processResearchLinks(researchLinks: string): Promise<string> {
    const linksArray = researchLinks.split(",").map((link) => link.trim());
    const summaries = [];

    for (const link of linksArray) {
        try {
            const response = await axios.get(link, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                },
            });
            const htmlContent = response.data;
            const chunks = chunkText(htmlContent, 5000);
            const chunkSummaries = await summarizeChunks(chunks);
            summaries.push(`- **${link}**: ${chunkSummaries.join(' ')}`);
        } catch (error) {
            console.error(`Failed to process link: ${link}`, error);
            summaries.push(`- **${link}**: Failed to retrieve content or summarize.`);
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

// Function to generate an image from a prompt
async function generateImage(prompt: string) {
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

// Function to upload image to WordPress
async function uploadImageToWordPress(imageUrl: string, site: any) {
    const wordpressMediaUrl = `${site.site_url}/wp-json/wp/v2/media`;
    const auth = {
        username: site.wp_username,
        password: site.api_password,
    };

    try {
        const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const imageData = Buffer.from(imageResponse.data, "binary");

        const response = await axios.post(wordpressMediaUrl, imageData, {
            auth,
            headers: {
                "Content-Disposition": `attachment; filename="generated-image.jpg"`,
                "Content-Type": "image/jpeg",
            },
        });

        return response.data.id;
    } catch (error) {
        console.error("Error uploading image to WordPress:", error);
        throw error;
    }
}

// Function to publish a post to WordPress
async function publishToWordPress(title: string, content: string, site: any, data: any, featuredImageId: number | null) {
    const wordpressUrl = site.site_url + "/wp-json/wp/v2/posts";
    const auth = {
        username: site.wp_username,
        password: site.api_password,
    };

    const post = {
        title: title,
        content: content,
        status: "draft",
        categories: data.category_id ? [parseInt(data.category_id)] : null,
        tags: data.tag_id ? [parseInt(data.tag_id)] : null,
        ...(featuredImageId && { featured_media: featuredImageId }),
    };

    try {
        const response = await axios.post(wordpressUrl, post, { auth });
        return response.data;
    } catch (error) {
        console.error("Error publishing to WordPress:", error);
        throw error;
    }
}

// Function to format content for WordPress
function formatContentForWordPress(content: string) {
    const htmlContent = marked.parse(content);
    return htmlContent;
}