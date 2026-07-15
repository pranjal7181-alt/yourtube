import Comments from "@/components/Comments";
import RelatedVideos from "@/components/RelatedVideos";
import VideoInfo from "@/components/VideoInfo";
import Videopplayer from "@/components/Videopplayer";
import WatchPartyButton from "@/components/watchparty/WatchPartyButton";
import DownloadButton from "@/components/DownloadButton";
import axiosInstance from "@/lib/axiosinstance";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const demoVideos = [
  {
    _id: "demo-video-1",
    videotitle: "Amazing Nature Documentary",
    filename: "nature.mp4",
    filetype: "video/mp4",
    filepath: "/video/vdo.mp4",
    filesize: "25 MB",
    videochanel: "Nature World",
    Like: 1250,
    views: 45000,
    uploader: "Nature World",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "demo-video-2",
    videotitle: "Cooking Tutorial: Perfect Pasta",
    filename: "cooking.mp4",
    filetype: "video/mp4",
    filepath: "/video/vdo.mp4",
    filesize: "18 MB",
    videochanel: "Chef's Kitchen",
    Like: 890,
    views: 23000,
    uploader: "Chef Master",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "demo-video-3",
    videotitle: "Learn Web Development",
    filename: "web-development.mp4",
    filetype: "video/mp4",
    filepath: "/video/vdo.mp4",
    filesize: "30 MB",
    videochanel: "Code Academy",
    Like: 2100,
    views: 67000,
    uploader: "Code Academy",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    _id: "demo-video-4",
    videotitle: "Beautiful Travel Destinations",
    filename: "travel.mp4",
    filetype: "video/mp4",
    filepath: "/video/vdo.mp4",
    filesize: "22 MB",
    videochanel: "Travel Explorer",
    Like: 1750,
    views: 52000,
    uploader: "Travel Explorer",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

const WatchVideoPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [allVideos, setAllVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || typeof id !== "string") {
      return;
    }

    const fetchVideo = async () => {
      try {
        const response = await axiosInstance.get("/video/getall");

        const receivedVideos = Array.isArray(response.data)
          ? response.data
          : [];

        if (receivedVideos.length > 0) {
          const selectedVideo = receivedVideos.find(
            (video: any) => video._id === id
          );

          setAllVideos(receivedVideos);
          setCurrentVideo(selectedVideo || receivedVideos[0]);
        } else {
          const selectedDemoVideo = demoVideos.find(
            (video) => video._id === id
          );

          setAllVideos(demoVideos);
          setCurrentVideo(selectedDemoVideo || demoVideos[0]);
        }
      } catch (error) {
        console.log("Backend unavailable. Showing demo video.", error);

        const selectedDemoVideo = demoVideos.find(
          (video) => video._id === id
        );

        setAllVideos(demoVideos);
        setCurrentVideo(selectedDemoVideo || demoVideos[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id, router.isReady]);

  const handleNextVideo = () => {
    const currentIndex = allVideos.findIndex(
      (video) => video._id === currentVideo?._id
    );

    if (currentIndex >= 0 && currentIndex < allVideos.length - 1) {
      router.push(`/watch/${allVideos[currentIndex + 1]._id}`);
    } else {
      router.push(`/watch/${allVideos[0]._id}`);
    }
  };

  if (loading) {
    return <div className="p-6">Loading video...</div>;
  }

  if (!currentVideo) {
    return <div className="p-6">Video not found.</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl p-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Videopplayer video={currentVideo} />

            <div className="flex justify-end">
              <button
                onClick={handleNextVideo}
                className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
              >
                Next Video ▶
              </button>
            </div>

            {!currentVideo._id.startsWith("demo-video") && (
              <div className="flex justify-end gap-3">
                <DownloadButton videoId={currentVideo._id} />
                <WatchPartyButton />
              </div>
            )}

            <VideoInfo video={currentVideo} />

            {!currentVideo._id.startsWith("demo-video") && (
              <Comments videoId={currentVideo._id} />
            )}
          </div>

          <div className="space-y-4">
            <RelatedVideos videos={allVideos} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchVideoPage;