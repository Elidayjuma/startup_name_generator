const axios = require("axios");
const { OpenAI } = require("openai");
const marked = require("marked");
import { updatePrompt,returnSingleSite } from "@/actions/actions";

// OpenAI configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});
type PromptData = {
    prompt: string,
    id: number,
    category_id: string,
    tag_id: string,
    image_status: number,
    prompt_id?: number 
}

// Function to create and publish the post
export const WORDPRESS_SYNTHESIZE_BLOG = async (data: PromptData) => {
  const prompt = data.prompt;
  const site = await returnSingleSite(data.id);

  try {
    // Generate post content using OpenAI
    const { title, content } = await generatePostContent(prompt);

    // Initialize featured image ID
    let featuredImageId = null;

    // Generate and upload image if enabled
    if (data.image_status === 1) {
      const imageUrl = await generateImage(prompt);
      featuredImageId = await uploadImageToWordPress(imageUrl, site);
    }

    // Parse and format content
    const formattedContent = formatContentForWordPress(content);

    // Publish the post on WordPress
    const response = await publishToWordPress(title, formattedContent, site, data, featuredImageId);
    
    let prompt_info = {
      id: data.prompt_id,
      image_id: featuredImageId
    }
    await updatePrompt(prompt_info)

    return { success: true, title, postUrl: response.link };
  } catch (error) {
    console.error("Error during the blog synthesis process:", error);
    throw error;
  }
};

// Function to generate title and content using OpenAI
async function generatePostContent(prompt: string) {
  try {
    // Generate title
    const titleResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Generate a catchy title for a post about: ${prompt} DON'T ADD quotation marks!`,
        },
      ],
      max_tokens: 100,
    });
    const title = titleResponse.choices[0].message?.content;

    // Generate content
    const contentResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Write a detailed post about: ${prompt}`,
        },
      ],
      max_tokens: 5000,
    });
    const content = contentResponse.choices[0].message?.content;

    return { title, content };
  } catch (error) {
    console.error("Error generating post content:", error);
    throw error;
  }
}

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
    // Fetch the image from the generated URL
    const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const imageData = Buffer.from(imageResponse.data, "binary");

    // Upload the image to WordPress
    const response = await axios.post(wordpressMediaUrl, imageData, {
      auth,
      headers: {
        "Content-Disposition": `attachment; filename="generated-image.jpg"`,
        "Content-Type": "image/jpeg", // Adjust this if using other formats
      },
    });

    return response.data.id; // Return the uploaded image ID
  } catch (error) {
    console.error("Error uploading image to WordPress:", error);
    throw error;
  }
}


// Function to publish a post to WordPress
async function publishToWordPress(title: string, content: string, site: any, data: any,featuredImageId: number | null) {
  const wordpressUrl = site.site_url+"/wp-json/wp/v2/posts";
  const auth = {
    username: site.wp_username, // Replace with your username
    password: site.api_password, // Replace with your application password
  };

  const post = {
    title: title,
    content: content,
    status: "draft", // Publish immediately
    categories: data.category_id? [parseInt(data.category_id)] : null,
    tags: data.tag_id? [parseInt(data.tag_id)] : null,
    ...(featuredImageId && { featured_media: featuredImageId }),
  };

  try {
    const response = await axios.post(wordpressUrl, post, { auth });
    return response.data; // Return the response data, including the post link
  } catch (error) {
    console.error("Error publishing to WordPress:", error);
    throw error;
  }
}

// Function to format content for WordPress
function formatContentForWordPress(content: string) {
  // Convert Markdown to HTML if needed
  const htmlContent = marked.parse(content); // Use marked for Markdown to HTML conversion

  // If you need additional sanitization, you can implement it here
  return htmlContent;
}

