import axiosInstance from "@/lib/axiosinstance";
import { useUser } from "@/lib/AuthContext";

interface Props {
  videoId: string;
}

export default function DownloadButton({ videoId }: Props) {
  const { user } = useUser();

  const handleDownload = async () => {
    if (!user) {
      alert("Please login first.");
      return;
    }

    try {
      const res = await axiosInstance.post(`/download/${videoId}`, {
        userId: user._id,
        userPlan: (user.plan || "free").toLowerCase(),
      });

      const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
      const filepath = res.data.filepath.replace(/\\/g, "/");

      const link = document.createElement("a");
      link.href = `${backend}/${filepath}`;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(res.data.message);
    } catch (err: any) {
      alert(err.response?.data?.message || "Download failed");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
    >
      Download
    </button>
  );
}