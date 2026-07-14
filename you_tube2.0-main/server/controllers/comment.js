import comment from "../Modals/comment.js";
import mongoose from "mongoose";
const abusiveWords = [
  "idiot",
  "stupid",
  "hate",
  "fool",
  "bastard",
  "moron",
  "loser"
];

export const postcomment = async (req, res) => {
  const { commentbody } = req.body;

  // Abusive words
  const abusiveWords = [
    "idiot",
    "stupid",
    "fool",
    "hate",
    "bastard",
    "fuck",
    "shit"
  ];

  const lowerComment = commentbody.toLowerCase();

  if (
    abusiveWords.some((word) =>
      lowerComment.includes(word)
    )
  ) {
    return res.status(400).json({
      message: "Abusive words are not allowed.",
    });
  }

  // Special character spam
  if (/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+$/.test(commentbody)) {
    return res.status(400).json({
      message: "Special character comments are not allowed.",
    });
  }

  // Repeated word spam
  if (/(\b\w+\b)(\s+\1){3,}/i.test(commentbody)) {
    return res.status(400).json({
      message: "Spam comment detected.",
    });
  }

  const postcomment = new comment(req.body);

  try {
    await postcomment.save();

    return res.status(200).json({
      comment: true,
      data: postcomment,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// GET ALL COMMENTS
export const getallcomment = async (req, res) => {
  const { videoid } = req.params;

  try {
    const commentvideo = await comment.find({ videoid });

    return res.status(200).json(commentvideo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// DELETE COMMENT
export const deletecomment = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("Comment unavailable");
  }

  try {
    await comment.findByIdAndDelete(id);

    return res.status(200).json({
      comment: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// EDIT COMMENT
export const editcomment = async (req, res) => {
  const { id } = req.params;
  const { commentbody } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("Comment unavailable");
  }

  try {
    const updatecomment = await comment.findByIdAndUpdate(
      id,
      {
        $set: {
          commentbody,
        },
      },
      { new: true }
    );

    return res.status(200).json(updatecomment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// LIKE COMMENT
export const likecomment = async (req, res) => {
  const { id } = req.params;
  const { userid } = req.body;

  try {
    const Comment = await comment.findById(id);

    if (!Comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (Comment.likes.includes(userid)) {
      Comment.likes.pull(userid);
    } else {
      Comment.likes.push(userid);
      Comment.dislikes.pull(userid);
    }

    await Comment.save();

    return res.status(200).json(Comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// DISLIKE COMMENT
export const dislikecomment = async (req, res) => {
  const { id } = req.params;
  const { userid } = req.body;

  try {
    const Comment = await comment.findById(id);

    if (!Comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (Comment.dislikes.includes(userid)) {
      Comment.dislikes.pull(userid);
    } else {
      Comment.dislikes.push(userid);
      Comment.likes.pull(userid);
    }

    await Comment.save();

    return res.status(200).json(Comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// REPORT COMMENT
export const reportcomment = async (req, res) => {
  const { id } = req.params;
  const { userid } = req.body;

  try {
    const Comment = await comment.findById(id);

    if (!Comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (!Comment.reports.includes(userid)) {
      Comment.reports.push(userid);
    }

    Comment.reported = true;

    await Comment.save();

    return res.status(200).json({
      success: true,
      message: "Comment reported successfully",
      comment: Comment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};