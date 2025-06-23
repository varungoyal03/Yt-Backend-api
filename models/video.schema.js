import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailId: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: ["education", "entertainment", "sports", "tech", "other"],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    disLikedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    viewedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ✅ Virtual computed fields
videoSchema.virtual("likes").get(function () {
  return this.likedBy?.length || 0;
});

videoSchema.virtual("dislikes").get(function () {
  return this.disLikedBy?.length || 0;
});

videoSchema.virtual("views").get(function () {
  return this.viewedBy?.length || 0;
});

// ✅ Performance indexes
videoSchema.index({ userId: 1 });            // For filtering videos by user
videoSchema.index({ category: 1 });          // For filtering by category
videoSchema.index({ createdAt: -1 });        // For sorting by newest videos

const Video = mongoose.model("Video", videoSchema);
export default Video;
