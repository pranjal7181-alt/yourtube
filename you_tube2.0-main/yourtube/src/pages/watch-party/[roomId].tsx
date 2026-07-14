import { useRouter } from "next/router";
import VideoCall from "@/components/VideoCall";

const WatchPartyPage = () => {
  const router = useRouter();
  const { roomId } = router.query;

  if (!roomId || typeof roomId !== "string") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <VideoCall roomId={roomId} />
    </div>
  );
};

export default WatchPartyPage;