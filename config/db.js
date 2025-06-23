// config/db.js

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load .env before using process.env

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
     
    });

    console.log(`✅ Connected to MongoDB at ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};
