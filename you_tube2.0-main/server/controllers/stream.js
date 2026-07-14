import { StreamChat } from "stream-chat";

export const generateToken = async (req, res) => {
  try {
    const { userId } = req.params;

    const apiKey = process.env.STREAM_API_KEY;
    const apiSecret = process.env.STREAM_SECRET;

    if (!apiKey || !apiSecret) {
      return res.status(500).json({
        message: "Stream credentials missing",
      });
    }

    const serverClient = StreamChat.getInstance(apiKey, apiSecret);

    const token = serverClient.createToken(userId);

    return res.status(200).json({ token });
  } catch (error) {
    console.error("STREAM ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};