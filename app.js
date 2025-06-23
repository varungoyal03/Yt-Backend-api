import express from "express";

import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js"
// import videoRoutes from "./routes/video.routes.js"
// import commentRoutes from "./routes/comment.routes.js"
// import bodyParser from "body-parser";
import fileUpload from "express-fileupload";



 const app = express();

 connectDB()



app.use(express.json())
 app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
 }))
 console.log("request came")
// app.use("/api/user" , userRoutes )
// app.use("/api/video" , videoRoutes)
// app.use("/api/comments", commentRoutes);

app.use("/api/v1/user",userRoutes

)

 export default app;