const axios = require("axios");

export async function uploadImageToWordPress(imageUrl: string, site: any) {
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