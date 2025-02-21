const { OpenAI } = require("openai");
const { TwitterApi } = require("twitter-api-v2");

const bearer_token = process.env.TWITTER_BEARER_TOKEN_NENOPRESS;
const consumer_key = process.env.TWITTER_CONSUMER_KEY_NENOPRESS;
const consumer_secret = process.env.TWITTER_CONSUMER_SECRET_NENOPRESS;
const access_token_key = process.env.TWITTER_ACCESS_TOKEN_KEY_NENOPRESS;
const access_token_secret = process.env.TWITTER_ACCESS_TOKEN_SECRET_NENOPRESS;

// OpenAI configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

/**
 * Function to generate 9 tweets from a given prompt.
 * @param {string} prompt - The prompt to guide tweet generation.
 * @returns {Promise<string[]>} - An array of 9 generated tweets.
 */
export const GENERATE_TWEETS = async (prompt: string) => {
  try {
    // Generate tweets using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Generate 9 concise tweets based on this prompt: "${prompt}". 
          Each tweet should be engaging, easy to read, and no longer than 280 characters.
          The tweets MUST not be identical and they should qualify to be published individually.
          Do not number the tweets.
          Don't add quatation marks around each tweet. 
          Separate each tweet clearly.`,
        },
      ],
      max_tokens: 500,
    });

    const rawTweets = response.choices[0].message?.content;

    // Split the response into individual tweets (assuming they're separated by line breaks or numbered)
    const tweets = rawTweets.split("\n").filter((tweet: string) => tweet.trim() !== "");
    return tweets.slice(0, 9); // Ensure exactly 9 tweets
  } catch (error) {
    console.error("Error generating tweets:", error);
    throw error;
  }
}

//new function to 
export const POST_A_TWEET = async (data: any) => {
    try {
      const twitterClient = new TwitterApi({
          appKey: consumer_key,
          appSecret: consumer_secret,
          accessToken: access_token_key,
          accessSecret: access_token_secret,
        });
        
    const { data: createdTweet } = await twitterClient.v2.tweetThread([
      data.status,
      data.status_url,
    ]);
    
    return createdTweet;
  } catch (err) {
    console.log(err);
    return {
      status: "failed",
      err,
    };
  }
};

//new function to publish a tweet using 3rd party accounts
export const POST_A_TWEET_3RD_PARTY = async (data: any, twitterTokens: any) => {
  try {
    const twitterClient = new TwitterApi({
        appKey: consumer_key,
        appSecret: consumer_secret,
        accessToken: twitterTokens.accesstoken,
        accessSecret: twitterTokens.accesssecret,
      });
      
  const { data: createdTweet } = await twitterClient.v2.tweetThread([data]);
  
  return createdTweet;
} catch (err) {
  console.log(err);
  return {
    status: "failed",
    err,
  };
}
};


