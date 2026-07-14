"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Download } from "lucide-react";
import axiosInstance from "@/lib/axiosinstance";
import { useUser } from "@/lib/AuthContext";

export default function DownloadsContent() {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadDownloads();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadDownloads = async () => {
    try {
      const res = await axiosInstance.get(`/download/${user?._id}`);
      setDownloads(res.data);
    } catch (error) {
      console.error("Error loading downloads:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading downloads...</div>;

  if (!user) {
    return (
      <div className="text-center py-12">
        <Download className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold">Please login first</h2>
      </div>
    );
  }

  if (downloads.length === 0) {
    return (
      <div className="text-center py-12">
        <Download className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold">No downloaded videos</h2>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {downloads.map((video) => (
        <div key={video._id} className="flex gap-4">
          <Link href={`/watch/${video._id}`}>
            <div className="relative w-40 aspect-video rounded overflow-hidden">
              <video
                src={`http://localhost:5000/${video.filepath.replace(/\\/g, "/")}`}
                className="w-full h-full object-cover"
                muted
                preload="metadata"
              />
            </div>
          </Link>

          <div>
            <h3 className="font-semibold">{video.videotitle}</h3>
            <p>{video.videochanel}</p>
            <p>
              {video.views.toLocaleString()} views •{" "}
              {formatDistanceToNow(new Date(video.createdAt))} ago
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}