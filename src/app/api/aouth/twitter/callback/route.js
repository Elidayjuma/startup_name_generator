import { TwitterApi } from "twitter-api-v2";
import { NextResponse } from "next/server";
import { returnTwitterToken, createTwitterToken } from "@/actions/actions";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const oauth_token = searchParams.get("oauth_token");
  const oauth_verifier = searchParams.get("oauth_verifier");

  if (!oauth_token || !oauth_verifier) {
    return NextResponse.json({ error: "Invalid request" });
  }
  const twitterTokens = await returnTwitterToken();
  try {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY_NENOPRESS,
      appSecret: process.env.TWITTER_CONSUMER_SECRET_NENOPRESS,
      accessToken: oauth_token,
      accessSecret: twitterTokens.oauth_token_secret, // Retrieve from session or DB
    });

    const {
      client: loggedClient,
      accessToken,
      accessSecret,
    } = await client.login(oauth_verifier);

    console.log(client, accessSecret, accessToken);
    // Store accessToken & accessSecret in session or database
    let data = { access_token: accessToken, access_secret: accessSecret };
    await createTwitterToken(data);

    return NextResponse.redirect(`${process.env.BASE_URL}/twitter`);
  } catch (error) {
    console.error("Error obtaining access token:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
