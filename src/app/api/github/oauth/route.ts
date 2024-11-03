import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const res = await axios.get("https://github.com/login/oauth/access_token", {
      params: {
        client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `http://localhost:3000/auth/github/callback`,
      },
      headers: {
        Accept: "application/json",
      },
    });

    const { access_token } = res.data;
    console.log("Token received:", access_token);

    return NextResponse.json({ access_token });
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    return NextResponse.json(
      { error: "Failed to exchange code for access token" },
      { status: 500 }
    );
  }
}
