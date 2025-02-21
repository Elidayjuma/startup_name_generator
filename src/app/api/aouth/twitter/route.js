import { TwitterApi } from "twitter-api-v2";
import { NextResponse } from "next/server";
import { createTwitterToken } from "@/actions/actions";

const client = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY_NENOPRESS,
  appSecret: process.env.TWITTER_CONSUMER_SECRET_NENOPRESS,
});

export async function GET(req) {
  try {
    const authLink = await client.generateAuthLink(
      process.env.TWITTER_CALLBACK_URL_NENOPRESS,
    );

    // Store oauth_token_secret in session or database

    let data = {};
    data.oauth_token = authLink.oauth_token;
    data.oauth_token_secret = authLink.oauth_token_secret;
    await createTwitterToken(data);
    return NextResponse.json(authLink);
  } catch (error) {
    console.error("Error generating auth link:", error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }

//   try {
//     const authLink = await client.generateAuthLink(
//       process.env.TWITTER_CALLBACK_URL,
//     );

//     // Store oauth_token_secret in session or database
//     console.log(authLink);
//     let data = {};
//     data.oauth_token = authLink.oauth_token;
//     data.oauth_token_secret = authLink.oauth_token_secret;
//     await createTwitterToken(data);

//     res.status(200).json(authLink);
//   } catch (error) {
//     console.error("Error generating auth link:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }
