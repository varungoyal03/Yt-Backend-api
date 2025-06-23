import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    channelName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{10}$/, "Invalid phone number"],
    },
    password: { type: String, required: true },
    logoUrl: { type: String, required: true },
    logoId: { type: String, required: true },
    subscribers: {
      type: Number,
      default: 0,
    },
    subscribedChannels: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);


export default userModel;