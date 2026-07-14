import Download from "../Modals/download.js";
import Video from "../Modals/video.js";

export const downloadVideo = async (req, res) => {
  try {
    const { userId, userPlan } = req.body;
    console.log("User Plan:", userPlan);

    const { videoId } = req.params;

    // Check if video exists
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Count today's downloads
    const todayDownloads = await Download.countDocuments({
      userId,
      downloadDate: {
        $gte: today,
      },
    });

    // Download limits based on subscription plan
    let dailyLimit = 1;

    switch ((userPlan || "").toLowerCase()) {
      case "bronze":
        dailyLimit = 3;
        break;

      case "silver":
        dailyLimit = 7;
        break;

      case "gold":
        dailyLimit = 10;
        break;

      default:
        dailyLimit = 1; // Free plan
    }

    // Check limit
    if (todayDownloads >= dailyLimit) {
      return res.status(403).json({
        message: `Your daily download limit (${dailyLimit}) has been reached.`,
      });
    }

    // Save download history
    await Download.create({
      userId,
      videoId,
      userPlan,
      downloadDate: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Download allowed",
      filepath: video.filepath,
      remainingDownloads: dailyLimit - (todayDownloads + 1),
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get all downloaded videos of a user
export const getDownloadedVideos = async (req, res) => {
  try {
    const { userId } = req.params;

    const downloads = await Download.find({ userId });

    const videoIds = downloads.map((download) => download.videoId);

    const videos = await Video.find({
      _id: { $in: videoIds },
    });

    return res.status(200).json(videos);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch downloaded videos",
    });
  }
};