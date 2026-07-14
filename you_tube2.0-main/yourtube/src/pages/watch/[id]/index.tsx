import Comments from "@/components/Comments";
import RelatedVideos from "@/components/RelatedVideos";
import VideoInfo from "@/components/VideoInfo";
import Videopplayer from "@/components/Videopplayer";
import WatchPartyButton from "@/components/watchparty/WatchPartyButton";
import axiosInstance from "@/lib/axiosinstance";
import DownloadButton from "@/components/DownloadButton";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const index = () => {
  const router = useRouter();
  const { id } = router.query;

  const [videos, setvideo] = useState<any>(null);
  const [video, setvide] = useState<any>(null);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const fetchvideo = async () => {
      if (!id || typeof id !== "string") return;

      try {
        const res = await axiosInstance.get("/video/getall");
        const currentVideo = res.data?.filter((vid: any) => vid._id === id);

        setvideo(currentVideo[0]);
        setvide(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    };

    fetchvideo();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!videos) {
    return <div>Video not found</div>;
  }

  const handleNextVideo = () => {
    const currentIndex = video.findIndex((v: any) => v._id === videos._id);

    if (currentIndex < video.length - 1) {
      router.push(`/watch/${video[currentIndex + 1]._id}`);
    } else {
      alert("No next video available.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Section */}
          <div className="lg:col-span-2 space-y-4">

            <Videopplayer video={videos} />

            {/* Next Video Button */}
            <div className="flex justify-end">
              <button
                onClick={handleNextVideo}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
              >
                Next Video ▶
              </button>
            </div>

            {/* Download & Watch Party */}
            <div className="flex justify-end gap-3">
              <DownloadButton videoId={videos._id} />
              <WatchPartyButton />
            </div>

            <VideoInfo video={videos} />

            <Comments videoId={id} />
          </div>

          {/* Right Section */}
          <div className="space-y-4">
            <RelatedVideos videos={video} />
          </div>

        </div>
      </div> 
    </div>
  );
};

export default index; 