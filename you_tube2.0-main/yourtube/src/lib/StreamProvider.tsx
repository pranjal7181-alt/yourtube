import {
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { ReactNode, useEffect, useMemo } from "react";
import { useUser } from "./AuthContext";

interface Props {
  children: ReactNode;
}

export default function StreamProvider({ children }: Props) {
  const { user } = useUser();

  const client = useMemo(() => {
    if (!user) return null;

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;

    const streamUser: User = {
      id: user._id,
      name: user.name,
      image: user.profilePic || "",
    };

    return new StreamVideoClient({
      apiKey,
      user: streamUser,
      tokenProvider: async () => {
        const res = await fetch(
          `${backendUrl}/stream/token/${user._id}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch Stream token");
        }

        const data = await res.json();
        return data.token;
      },
    });
  }, [user]);

  useEffect(() => {
    return () => {
      client?.disconnectUser();
    };
  }, [client]);

  if (!client) return <>{children}</>;

  return <StreamVideo client={client}>{children}</StreamVideo>;
}