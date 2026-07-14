import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";

interface Comment {
  _id: string;
  videoid: string;
  userid: string;
  commentbody: string;
  usercommented: string;
  commentedon: string;
  likes: string[];
  dislikes: string[];
  reported: boolean;
  translatedText?: string;
}

const Comments = ({ videoId }: any) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingCommentId, setEditingCommentId] =
    useState<string | null>(null);

  const [editText, setEditText] = useState("");

  const { user } = useUser();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [videoId]);

  const loadComments = async () => {
    try {
      const res = await axiosInstance.get(`/comment/${videoId}`);
      setComments(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading comments...</div>;
  }

  // ================= POST COMMENT =================

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);

    try {
      const res = await axiosInstance.post("/comment/postcomment", {
        videoid: videoId,
        userid: user._id,
        commentbody: newComment,
        usercommented: user.name,
      });

      if (res.data.comment) {
        // Reload comments from MongoDB
        await loadComments();

        setNewComment("");
      }
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Failed to post comment."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= EDIT COMMENT =================

  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.commentbody);
  };

  const handleUpdateComment = async () => {
    if (!editText.trim()) return;

    try {
      const res = await axiosInstance.post(
        `/comment/editcomment/${editingCommentId}`,
        {
          commentbody: editText,
        }
      );

      if (res.data) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === editingCommentId
              ? {
                  ...c,
                  commentbody: editText,
                }
              : c
          )
        );

        setEditingCommentId(null);
        setEditText("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // ================= DELETE COMMENT =================

  const handleDelete = async (id: string) => {
    try {
      const res = await axiosInstance.delete(
        `/comment/deletecomment/${id}`
      );

      if (res.data.comment) {
        setComments((prev) =>
          prev.filter((c) => c._id !== id)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ================= LIKE COMMENT =================

  const handleLike = async (id: string) => {
    if (!user) return;

    try {
      const res = await axiosInstance.patch(
        `/comment/like/${id}`,
        {
          userid: user._id,
        }
      );

      setComments((prev) =>
        prev.map((c) =>
          c._id === id ? res.data : c
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  // ================= DISLIKE COMMENT =================

  const handleDislike = async (id: string) => {
    if (!user) return;

    try {
      const res = await axiosInstance.patch(
        `/comment/dislike/${id}`,
        {
          userid: user._id,
        }
      );

      setComments((prev) =>
        prev.map((c) =>
          c._id === id ? res.data : c
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  // ================= REPORT COMMENT =================

  const handleReport = async (id: string) => {
    if (!user) return;

    try {
      const res = await axiosInstance.patch(
        `/comment/report/${id}`,
        {
          userid: user._id,
        }
      );

      if (res.data.success) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === id
              ? {
                  ...c,
                  reported: true,
                }
              : c
          )
        );

        alert("Comment reported successfully.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ================= TRANSLATE COMMENT =================

  const handleTranslate = async (
    id: string,
    text: string
  ) => {
    try {
      const res = await axiosInstance.post(
        "/translate",
        {
          text,
          target: "hi",
        }
      );

      setComments((prev) =>
        prev.map((c) =>
          c._id === id
            ? {
                ...c,
                translatedText:
                  res.data.translatedText,
              }
            : c
        )
      );
    } catch (error) {
      console.log(error);
      alert("Translation failed");
    }
  };
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {comments.length} Comments
      </h2>

      {user && (
        <div className="flex gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback>
              {user.name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e: any) =>
                setNewComment(e.target.value)
              }
              className="min-h-[80px] resize-none border-0 border-b-2 rounded-none focus-visible:ring-0"
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setNewComment("")}
              >
                Cancel
              </Button>

              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
              >
                {isSubmitting ? "Posting..." : "Comment"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 italic">
            No comments yet.
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="flex gap-4"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>
                  {comment.usercommented?.[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {comment.usercommented}
                  </span>

                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(
                      new Date(comment.commentedon)
                    )}{" "}
                    ago
                  </span>
                </div>

                {editingCommentId === comment._id ? (
                  <>
                    <Textarea
                      value={editText}
                      onChange={(e: any) =>
                        setEditText(e.target.value)
                      }
                    />

                    <div className="flex gap-2 mt-2">
                      <Button
                        onClick={handleUpdateComment}
                      >
                        Save
                      </Button>

                      <Button
                        variant="ghost"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditText("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mt-2">
                      {comment.commentbody}
                    </p>

                    {comment.translatedText && (
                      <p className="text-blue-600 text-sm mt-2">
                        🌐 {comment.translatedText}
                      </p>
                    )}

                    <div className="flex gap-5 mt-3 text-sm flex-wrap">
                      <button
                        onClick={() =>
                          handleLike(comment._id)
                        }
                      >
                        👍 {comment.likes?.length || 0}
                      </button>

                      <button
                        onClick={() =>
                          handleDislike(comment._id)
                        }
                      >
                        👎 {comment.dislikes?.length || 0}
                      </button>

                      <button
                        onClick={() =>
                          handleTranslate(
                            comment._id,
                            comment.commentbody
                          )
                        }
                      >
                        🌐 Translate
                      </button>

                      <button
                        disabled={comment.reported}
                        className={
                          comment.reported
                            ? "text-gray-400"
                            : "text-red-500"
                        }
                        onClick={() =>
                          handleReport(comment._id)
                        }
                      >
                        {comment.reported
                          ? "🚩 Reported"
                          : "🚩 Report"}
                      </button>

                      {comment.userid === user?._id && (
                        <>
                          <button
                            onClick={() =>
                              handleEdit(comment)
                            }
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(comment._id)
                            }
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;