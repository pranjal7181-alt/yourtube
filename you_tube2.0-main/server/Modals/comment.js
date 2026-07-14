import mongoose from "mongoose";

const commentschema = mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    videoid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "videofiles",
      required: true,
    },

    commentbody: {
      type: String,
      required: true,
    },

    usercommented: {
      type: String,
      required: true,
    },

    commentedon: {
      type: Date,
      default: Date.now,
    },
    reported: {
  type: Boolean,
  default: false,
},

reports: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
],

    // Comment Likes
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    // Comment Dislikes
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    // Users who reported the comment
    reports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    // Flag for admin review
    flagged: {
      type: Boolean,
      default: false,
    },

    // Optional location
    location: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("comment", commentschema);