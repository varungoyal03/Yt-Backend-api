import  express  from 'express';
import bcrypt from "bcrypt"
import cloudinary from '../config/cloudinary.js';
import User from "../models/user.schema.js"
const router=express.Router();
import jwt from "jsonwebtoken"

router.post("/signup",async (req,res)=>{
   try {
     if(!req.body?.password){
        throw new error("Data not given")
     }
    // do validation 
    //id user alredy exist check
    const hashedPassword=await bcrypt.hash(req.body.password,10);
    const uploadImage=await cloudinary.uploader.upload(req.files.logoUrl.tempFilePath);

console.log(uploadImage)

    const newUser = new User({
         email: req.body.email,
        password: hashedPassword,
        channelName: req.body.channelName,
        phone: req.body.phone,
        logoUrl: uploadImage.secure_url,
        logoId: uploadImage.public_id,
      });

       let user=await newUser.save();


res.status(201).json({message: "user added" ,data:user})
} catch (error) {
    
    res
    .status(400)
    .json({ error: "something went wrong", message: error.message });
}
   
    
});


router.post("/login",async (req,res)=>{
    try {
          const {email,password}=req.body;
          const existingUser = await User.findOne({ email: email });

          if (!existingUser) {
            return res.status(404).json({ message: "Invaild credentials" });
          }
      
          const isValid = await bcrypt.compare(
            req.body.password,
            existingUser.password
          );

          if(!isValid){
            return res.status(404).json({ message: "Invaild credentials" });
          }
          
    const token = jwt.sign(
        {
          _id: existingUser._id,
          channelName: existingUser.channelName,
          email: existingUser.email,
          phone: existingUser.phone,
          logoId: existingUser.logoId,
        },
        process.env.JWT_TOKEN,
        { expiresIn: "7d" }
      );
  
  
      res.status(200).json({

        message: "logged in " ,data:{
          _id: existingUser._id,
          channelName: existingUser.channelName,
          email: existingUser.email,
          phone: existingUser.phone,  
          logoId: existingUser.logoId,
          logoUrl:existingUser.logoUrl,
          token:token,
          subscribers:existingUser.subscribers,
          subscribedChannels:existingUser.subscribedChannels}
      })
        
    } catch (error) {
        res
        .status(400)
        .json({ error: "something went wrong", message: error.message });
    }
})
export default router