"use client";

import { useRef, useState } from "react";

interface VideoPlayerProps {
  video: {
    _id: string;
    videotitle: string;
    filepath: string;
  };
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const skipForward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += 10;
  };

  const skipBackward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime -= 10;
  };

  return (
    <div className="relative rounded-lg overflow-hidden bg-black">

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-xl font-semibold z-10">
          Loading...
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full aspect-video"
        controls
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadStart={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
      >
        <source
  src="/video/vdo.mp4"
  type="video/mp4"
/>
        Your browser does not support the video tag.
      </video>

      <div className="flex justify-center items-center gap-4 bg-gray-900 p-4">

        <button
          onClick={skipBackward}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          ⏪ 10 sec
        </button>

        <button
          onClick={handlePlayPause}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button
          onClick={skipForward}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          10 sec ⏩
        </button>

      </div>

    </div>
  );
}
