const marked = require("marked");
const axios = require("axios");

export async function publishToWordPress(title: string, content: string, site: any, data: any, featuredImageId: number | null) {
    const wordpressUrl = site.site_url + "/wp-json/wp/v2/posts";
    const auth = {
        username: site.wp_username,
        password: site.api_password,
    };

    const post = {
        title: title,
        content: formatContentForWordPress(content),
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

function formatContentForWordPress(content: string) {
    const htmlContent = marked.parse(content);
    return htmlContent;
}