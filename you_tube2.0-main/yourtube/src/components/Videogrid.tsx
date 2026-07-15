import React, { useEffect, useState } from "react";
import Videocard from "./videocard";
import axiosInstance from "@/lib/axiosinstance";

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

const Videogrid = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axiosInstance.get("/video/getall");

        if (Array.isArray(response.data) && response.data.length > 0) {
          setVideos(response.data);
        } else {
          setVideos(demoVideos);
        }
      } catch (error) {
        console.log("Backend is unavailable. Showing demo videos.", error);
        setVideos(demoVideos);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <p className="p-4">Loading videos...</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <Videocard key={video._id} video={video} />
      ))}
    </div>
  );
};

export default Videogrid;