import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ChannelHeader from "@/components/ChannelHeader";
import Channeltabs from "@/components/Channeltabs";
import ChannelVideos from "@/components/ChannelVideos";
import VideoUploader from "@/components/VideoUploader";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";

const Index = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();

  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
  if (id) {
    getVideos();
  }
}, [id]);

  const getVideos = async () => {
    try {
      const response = await axiosInstance.get("/video/getall");
      setVideos(response.data);
    } catch (error) {
      console.log("Error fetching videos:", error);
    }
  };

  try {
    let channel = user;

    return (
      <div className="flex-1 min-h-screen bg-white">
        <div className="max-w-full mx-auto">
          <ChannelHeader channel={channel} user={user} />

          <Channeltabs />

          <div className="px-4 pb-8">
            <VideoUploader
              channelId={id}
              channelName={channel?.channelname}
            />
          </div>

          <div className="px-4 pb-8">
            <ChannelVideos videos={videos} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching channel data:", error);
    return <div>Something went wrong</div>;
  }
};

export default Index;