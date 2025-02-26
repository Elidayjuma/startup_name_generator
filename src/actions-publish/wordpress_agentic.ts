
import {prePromptReviewer} from "../agents/prePromptReviewer";
import { postPromptReviewer } from "@/agents/postPromptReviewer";
import { generateHeading } from "../agents/headingGenerator";
import { convertToSearchablePhrase } from "../agents/searchPhraseGenerator";
import { searchGoogle } from "../agents/googleSearchAgent";
import { summarizeArticles } from "../agents/articleSummarizer";
import { generateBlogOutlineAndFAQs } from "../agents/blogOutlineGenerator";
import { generateContentForOutline } from "../agents/contentGenerator";
import { generateImage } from "@/agents/imageGenerator";
import { publishToWordPress } from "../agents/wordpressPublisher";
import { uploadImageToWordPress } from "../agents/worpressImageUploader";
import { returnSingleSite, updatePrompt } from "@/actions/actions";

type PromptData = {
    prompt: string,
    id: number,
    category_id: string,
    tag_id: string,
    image_status: number,
    research_option: number,
    prompt_id?: number,
    research_links?: string,
};

export const WORDPRESS_SYNTHESIZE_BLOG_WITH_AGENTS = async (data: PromptData) => {
    const prompt = data.prompt;
    const site = await returnSingleSite(data.id);

    try {
        const { format, refinedPrompt } = await prePromptReviewer(prompt);
        const heading = await generateHeading(format, refinedPrompt);
        let content = "";
        let fullContent = "";
        let featuredImageId = null;
        let outline = "";
        let faqs = "";

        if (data.research_option === 1) {

            const searchablePhrase = await convertToSearchablePhrase(heading);
            const searchResults = await searchGoogle(searchablePhrase);
            const summaries = await summarizeArticles(searchResults);
            ({ outline, faqs } = await generateBlogOutlineAndFAQs(summaries));
            content = await generateContentForOutline(outline, summaries);
            fullContent = `${content}\n\nFAQs:\n${faqs}`;

        } else {

            ({ outline, faqs } = await generateBlogOutlineAndFAQs(refinedPrompt));
            content = await generateContentForOutline(outline, "");
            fullContent = `${content}\n\nFAQs:\n${faqs}`;

        }
        const review = await postPromptReviewer(heading, fullContent);

if (!review.isAligned || review.seoScore < 70) {
    console.warn("Blog post may need improvements:", review.feedback);
    // Handle cases where post quality is below expected standards
    return
}

        if (data.image_status === 1) {
            const imageUrl = await generateImage(prompt);
            featuredImageId = await uploadImageToWordPress(imageUrl as string, site);
        }

        const response = await publishToWordPress(heading, fullContent, site, data, featuredImageId);

        await updatePrompt({
            id: data.prompt_id,
            image_id: featuredImageId,
        });

        return { success: true, title: heading, postUrl: response.link };
    } catch (error) {
        console.error("Error during the blog synthesis process:", error);
        throw error;
    }
};