import { Users } from "lucide-react";
import { useRouter } from "next/router";

const WatchPartyButton = () => {
  const router = useRouter();

  const createRoom = () => {
    const roomId = Math.random().toString(36).substring(2, 10);
    router.push(`/watch-party/${roomId}`);
  };

  return (
    <button
      onClick={createRoom}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
    >
      <Users size={18} />
      Watch Party
    </button>
  );
};

export default WatchPartyButton;