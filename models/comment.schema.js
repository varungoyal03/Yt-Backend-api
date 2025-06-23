import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    commentText: {
      type: String,
      required: true,
      trim: true,
      maxLength: [1000, "Comment cannot exceed 1000 characters"],
      minLength: [1, "Comment cannot be empty"],
    },
  },
  { timestamps: true }
);

// ✅ Compound index for performance
commentSchema.index({ videoId: 1, createdAt: -1 });

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
