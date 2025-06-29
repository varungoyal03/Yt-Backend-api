import express from "express";

import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js"

import fileUpload from "express-fileupload";
import videoRoutes from "./routes/video.routes.js"
import commentRoutes from "./routes/comment.routes.js"

 const app = express();

 connectDB()



app.use(express.json())
 app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}))

console.log("request came")
app.use("/api/v1/user" , userRoutes )
app.use("/api/v1/video",videoRoutes)
app.use("/api/comments",commentRoutes);


 export default app;