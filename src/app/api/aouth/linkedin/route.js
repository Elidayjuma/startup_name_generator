import { NextResponse } from "next/server";
import axios from "axios";
import { createLinkedInToken, createLinkedinUser } from "@/actions/actions";

const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const REDIRECT_URI = process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI;
// const REDIRECT_URI = process.env.LINKEDIN_FINAL_AUTH_REDIRECT;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code is missing" },
      { status: 400 },
    );
  }

  // Prepare request body for LinkedIn token exchange
  const reqBody = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    state: "ready_for_user",
    redirect_uri: REDIRECT_URI,
    client_id: LINKEDIN_CLIENT_ID,
    client_secret: LINKEDIN_CLIENT_SECRET,
  });

  try {
    // Send POST request to LinkedIn to exchange code for an access token
    const response = await axios.post(
      `https://www.linkedin.com/oauth/v2/accessToken`,
      reqBody.toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    const token_data = response.data;
    const { expires_in, access_token } = response.data;
    const expirationTime = new Date(Date.now() + expires_in * 1000);
    token_data.expires_in = expirationTime;
    await createLinkedInToken(token_data);

    const userInfoResponse = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    const userInfo = userInfoResponse.data;
    await createLinkedinUser(userInfo);

    // return NextResponse.json({
    //   token: token_data,
    //   user: userInfo,
    // });
    return NextResponse.redirect("http://localhost:3000/linkedin");
  } catch (error) {
    return NextResponse.json(
      { error: error.response?.data || "Failed to fetch access token" },
      { status: 500 },
    );
  }
}

// Handle POST requests
export async function POST(req) {
  try {
    const body = await req.json(); // Parse request body
    console.log(body);
    return NextResponse.json({ message: "POST request received", data: body });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
