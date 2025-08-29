import User from '../model/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

export const login=async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({message:"Please enter all the fields"})
    }
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"User does not exist"})
    }
   const checked=await  bcrypt.compare(password,user.password);
   if(!checked){
    return res.status(400).json({message:"Invalid Password"})
   }
    const token=jwt.sign({id:user._id},process.env.JWTSECRET,{expiresIn:'1h'});  
    res.status(200).json({token,user:{id:user._id,name:user.name,email:user.email},msg:"Login Successful"});

}
export const signup=async(req,res)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        return res.status(400).json({message:"Please enter all the fields"})
    }
    const userExists=await User.findOne({email});
    if(userExists){
        return res.status(400).json({message:"User already exists"})
    }
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    const newUser=new User({
        name,
        email,
        password:hashedPassword
    });
    const savedUser=await newUser.save();
    const token=jwt.sign({id:savedUser._id},process.env.JWTSECRET,{expiresIn:'1h'});  
    
    res.status(201).json({token,user:{id:savedUser._id,name:savedUser.name,email:savedUser.email},msg:"User created successfully"});

}