const User = require("../models/user.js");
const {upload} = require("../utils/cloudinary.js");
const fs = require("fs");
const crypto = require("crypto");
exports.register = async (req,res) =>{
    try{
        const {name,email,password} = req.body;

        let user = await User.findOne({email});

        if(user){
            return res.status(400).json({
                success : false,
                message : "user already exist",
            })
        }
        
        const {public_id , url } =await upload(req.file.path);
        fs.unlinkSync(req.file.path);
        user = await User.create({name,email,password , avatar : {public_id, url}}) ;
        const token =  user.generatetoken();

        res.status(201).cookie("token",token ,{
            expires : new Date(Date.now() + 90*24*60*60*1000),
            httpOnly : true,
            sameSite : process.env.NODE_ENV === "development" ? "lax" : "none",
            secure : process.env.NODE_ENV === "development" ? false : true,
        })
        .json({
            success : true,
            token,
        })
    }
    catch(err){
        res.status(500).json({
            success : false,
            message : err.message,
        })
    }
};

exports.login = async (req,res) =>{

    try{
        const {email,password} = req.body;

        const user = await User.findOne({email}).select("+password");

        if(!user){
            return res.status(400).json({
                success : false,
                message : "user not found"
            })
        }

        const ismatch = await user.matchpassword(password);

        if(!ismatch){
            return res.status(400).json({
                success : false,
                message : "incorrect password"
            })
        }
        const token =  user.generatetoken();

        res.status(200).cookie("token",token ,{
            expires : new Date(Date.now() + 90*24*60*60*1000),
            httpOnly : true,
            sameSite : process.env.NODE_ENV === "development" ? "lax" : "none",
            secure : process.env.NODE_ENV === "development" ? false : true,
        })
        .json({
            success : true,
            token,
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

exports.logout = async (req,res) =>{
    try{
        res.status(200)
        .cookie("token" , null ,{expires : new Date(Date.now())
            ,httpOnly : true,
            sameSite : process.env.NODE_ENV === "development" ? "lax" : "none",
            secure : process.env.NODE_ENV === "development" ? false : true,
        })
        .json({
            success : true,
            message : "logged out"
        })
    }catch(err){
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

exports.myprofile = async (req,res) =>{
    try {
        const user = await User.findById(req.user._id)
        .populate("myServices")
        .populate("myOrders")
        .populate("myJobs")
        .populate("myJobApplications");

        res.status(200).json({
            success : true,
            user,
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            message : error.message,
        })
    }
}