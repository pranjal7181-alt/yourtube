import video from "../Modals/video.js";

export const uploadvideo = async (req, res) => {
  if (req.file === undefined) {
    return res
      .status(404)
      .json({ message: "plz upload a mp4 video file only" });
  } else {
    try {
      const file = new video({
        videotitle: req.body.videotitle,
        filename: req.file.originalname,
        filepath: req.file.path,
        filetype: req.file.mimetype,
        filesize: req.file.size,
        videochanel: req.body.videochanel,
        uploader: req.body.uploader,
      });
      await file.save();
      return res.status(201).json("file uploaded successfully");
    } catch (error) {
      console.error(" error:", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
};
export const getallvideo = async (req, res) => {
  try {
    console.log("Database:", video.db.name);
    console.log("Collection:", video.collection.name);

    const count = await video.countDocuments();
    console.log("Video Count:", count);

    const files = await video.find();
    console.log("Files:", files);

    return res.status(200).json(files);
  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};