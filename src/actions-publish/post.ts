const { OpenAI } = require("openai");

// OpenAI configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

export const GENERATE_POST = async (prompt: string) => {
  try {
    // Generate tweets using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Generate a post based on this prompt: "${prompt}".`,
        },
      ],
      max_tokens: 3000,
    });

    const rawPost = response.choices[0].message?.content;

    return rawPost
  } catch (error) {
    console.error("Error generating post:", error);
    throw error;
  }
}


