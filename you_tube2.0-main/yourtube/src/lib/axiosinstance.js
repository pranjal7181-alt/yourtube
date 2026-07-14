import axios from "axios";
console.log(process.env.NEXT_PUBLIC_BACKEND_URL);

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// Get all downloaded videos of a user
export const getDownloadedVideos = async (userId) => {
  try {
    const response = await axiosInstance.get(`/download/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching downloaded videos:", error);
    throw error;
  }
};

export default axiosInstance;