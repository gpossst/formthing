import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET(request: Request) {
  try {
    // Get GitHub token from request headers
    const githubToken = request.headers.get("Authorization")?.split(" ")[1];

    if (!githubToken) {
      return NextResponse.json(
        { error: "No authorization token provided" },
        { status: 401 }
      );
    }

    // Fetch user data from GitHub
    const githubResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
    });

    if (!githubResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch GitHub user" },
        { status: 400 }
      );
    }

    const githubUser = await githubResponse.json();

    // Connect to MongoDB
    const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI || "");

    try {
      await client.connect();
      const db = client.db("db1");
      const users = db.collection("users");

      // Check if user exists by email
      const existingUser = await users.findOne({ email: githubUser.email });

      if (existingUser) {
        return NextResponse.json({
          exists: true,
          user: existingUser,
        });
      } else {
        return NextResponse.json({
          exists: false,
          githubUser,
        });
      }
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
