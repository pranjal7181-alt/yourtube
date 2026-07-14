import { useEffect, useState } from "react";
import socket from "@/lib/socket";

interface Props {
  roomId: string;
  username: string;
}

interface Message {
  sender: string;
  message: string;
}

export default function WatchPartyChat({
  roomId,
  username,
}: Props) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.emit("join-room", roomId);

    socket.on("receive-message", (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send-message", {
      roomId,
      sender: username,
      message,
    });

    setMessage("");
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <h2 className="p-4 font-bold border-b border-gray-700">
        Chat
      </h2>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.sender}: </strong>
            {msg.message}
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-gray-700 flex gap-2">
        <input
          className="flex-1 rounded bg-gray-800 px-3 py-2 outline-none"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}