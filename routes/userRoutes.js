import  express  from 'express';
import bcrypt from "bcrypt"

import cloudinary from '../config/cloudinary.js';
import User from "../models/user.schema.js"
const router=express.Router();
import jwt from "jsonwebtoken"

router.post("/signup",async (req,res)=>{
   try {
     if(!req.body?.password){
        throw new Error("Data not given")
     }
    // do validation 
    //id user alredy exist check
    const hashedPassword=await bcrypt.hash(req.body.password,10);
    const uploadImage=await cloudinary.uploader.upload(req.files.logoUrl.tempFilePath);

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
        console.log(req.body);
        if(!req.body || !req.body.password || !req.body.email){throw new Error("Data not given") }
          const {email,password}=req.body;
          const existingUser = await User.findOne({ email: email });

          if (!existingUser) {
            return res.status(404).json({ message: "Invaild credentials" });
          }
      
          const isValid = await bcrypt.compare(
            password,
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

router.put("/update-profile" , checkAuth , async(req , res)=>{
    try {
      const {channelName , phone} = req.body;
      let updatedData = {channelName , phone}
  
  if(req.files && req.files.logoUrl){
    const uploadedImage = await cloudinary.uploader.upload(req.files.logoUrl.tempFilePath);
    updatedData.logoUrl = uploadedImage.secure_url;
    updatedData.logoId = uploadedImage.public_id
  }
  
  const updatedUser = await User.findByIdAndUpdate(req.user._id , updatedData , {new:true})
  
  res.status(200).json({message:"Profile Updated Successfully" , updatedUser})
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "something went wrong", message: error.message });
    }
  })
  
  
  //IMPROVE
router.post("/subscribe" , checkAuth , async (req , res)=>{
    try {
      const {channelId} = req.body // *userId = currentUser , channelId = user to subscribe ( channel)
      
      if(req.user._id === channelId){
        return res.status(400).json({error:"You cannot subscribe to yourself"})
      }
  


      const result = await User.updateOne(
        { _id: req.user._id },
        { $addToSet: { subscribedChannels: channelId } }
      );
      
      if (result.modifiedCount === 0) {
        return res.status(400).json({ error: "Already subscribed to this channel" });
      }

const subscribedUser = await User.findByIdAndUpdate(
  channelId,
  { $inc: { subscribers: 1 } },
  { new: true }
);

const currentUser = await User.findById(req.user._id);

res.status(200).json({
  message: "Subscribed successfully ✅",
  data: {
    currentUser,
    subscribedUser
  }
});


      
  
      res.status(200).json(
        {
          message:"Subscribed Successfully✅",
          data:{currentUser,
          subscribedUser
          }}
      )
  
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "something went wrong", message: error.message });
    }
  })



export default router