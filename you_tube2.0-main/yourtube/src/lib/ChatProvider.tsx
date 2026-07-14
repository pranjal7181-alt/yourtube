import { Chat } from "stream-chat-react";
import { StreamChat } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";

import { ReactNode, useEffect, useState } from "react";
import { useUser } from "./AuthContext";

interface Props {
  children: ReactNode;
}

export default function ChatProvider({ children }: Props) {
  const { user } = useUser();
  const [client, setClient] = useState<StreamChat | null>(null);

  useEffect(() => {
    if (!user) return;

    const chatClient = StreamChat.getInstance(
      process.env.NEXT_PUBLIC_STREAM_API_KEY!
    );

    const connect = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/stream/token/${user._id}`
        );

        const data = await res.json();

        await chatClient.connectUser(
          {
            id: user._id,
            name: user.name,
            image: user.profilePic || "",
          },
          data.token
        );

        setClient(chatClient);
      } catch (err) {
        console.error(err);
      }
    };

    connect();

    return () => {
      chatClient.disconnectUser();
    };
  }, [user]);

  if (!client) return <>{children}</>;

  return <Chat client={client}>{children}</Chat>;
}