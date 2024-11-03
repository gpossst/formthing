"use client";

import { useState, useEffect } from "react";

export default function GitHubSignIn() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSignIn = () => {
    const state = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    localStorage.setItem("latestCSRFToken", state);

    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = `http://localhost:3000/auth/github/callback`;
    const link = `https://github.com/login/oauth/authorize?client_id=${clientId}&response_type=code&scope=repo&redirect_uri=${redirectUri}&state=${state}`;

    window.location.assign(link);
  };

  return <button onClick={handleSignIn}>Sign in with GitHub</button>;
}
