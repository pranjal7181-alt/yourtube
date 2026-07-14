import React, { ReactNode, useMemo } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";

type Props = {
  children: ReactNode;
};

export default function StreamProvider({ children }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

  console.log("Stream API Key:", apiKey);

  const user = useMemo(
    () => ({
      id: "user-" + Math.random().toString(36).substring(2, 8),
      name: "Guest User",
    }),
    []
  );

  const tokenProvider = async () => {
  const response = await fetch("http://localhost:5000/stream/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: user.id,
    }),
  });

  const data = await response.json();
  return data.token;
};

  const client = useMemo(() => {
    if (!apiKey) {
      throw new Error("NEXT_PUBLIC_STREAM_API_KEY is missing");
    }

    return new StreamVideoClient({
      apiKey,
      user,
      tokenProvider,
    });
  }, [apiKey, user]);

  return <StreamVideo client={client}>{children}</StreamVideo>;
}

