"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";

export default function GitHubCallback() {
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleCallback() {
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      // Validate state to prevent CSRF attacks
      const storedState = localStorage.getItem("latestCSRFToken");
      if (state !== storedState) {
        console.error("State mismatch - possible CSRF attack");
        return;
      }
      localStorage.removeItem("latestCSRFToken");

      try {
        // Only send the code to our API endpoint
        const response = await axios.post("/api/github/oauth", { code });
        console.log("Response:", response.data);
      } catch (error) {
        console.error("Authentication failed:", error);
      }
    }

    if (searchParams.get("code")) {
      handleCallback();
    }
  }, [searchParams]);

  return <div>Processing GitHub authentication...</div>;
}
