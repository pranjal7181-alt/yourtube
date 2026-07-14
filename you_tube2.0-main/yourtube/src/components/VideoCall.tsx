import * as Stream from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/AuthContext";
import WatchPartyChat from "./watchparty/WatchPartyChat";

interface Props {
  roomId: string;
}

export default function VideoCall({ roomId }: Props) {
  const client = Stream.useStreamVideoClient();
  const { user } = useUser();

  const [call, setCall] = useState<any>(null);

  const inviteLink =
    typeof window !== "undefined"
      ? window.location.href
      : "";

  useEffect(() => {
    if (!client) return;

    const callInstance = client.call("default", roomId);

    const joinCall = async () => {
      try {
        await callInstance.join({ create: true });
        setCall(callInstance);
      } catch (error) {
        console.error("Failed to join call:", error);
      }
    };

    joinCall();

    return () => {
      callInstance.leave();
    };
  }, [client, roomId]);

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      alert("Invite link copied!");
    } catch (error) {
      console.error(error);
      alert("Failed to copy invite link.");
    }
  };

  if (!call) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Joining Watch Party...
      </div>
    );
  }

  return (
    <Stream.StreamCall call={call}>
      <Stream.StreamTheme>
        <div className="relative flex h-screen bg-black">

          {/* Invite Button */}
          <button
            onClick={copyInviteLink}
            className="absolute top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Invite Friends
          </button>

          {/* Video Section */}
          <div className="flex-1 flex flex-col">

            <div className="flex-1">
              <Stream.SpeakerLayout />
            </div>

            <Stream.CallControls />

          </div>

          {/* Right Sidebar */}
          <div className="w-80 flex flex-col border-l border-gray-700 bg-[#111827]">

            {/* Participants */}
            <div className="h-1/2 overflow-y-auto">

              <h2 className="text-white text-lg font-semibold p-4 border-b border-gray-700">
                Participants
              </h2>

              <Stream.CallParticipantsList
                onClose={() => {}}
              />

            </div>

            {/* Chat */}
            <div className="flex-1 border-t border-gray-700">

              <WatchPartyChat
                roomId={roomId}
                username={user?.name || "Guest"}
              />

            </div>

          </div>

        </div>
      </Stream.StreamTheme>
    </Stream.StreamCall>
  );
}