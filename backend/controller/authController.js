import User from '../model/usermodel.js'
import validator from "validator"
import bcrypt from "bcryptjs"
import token from "../config/token.js"
import gentoken from '../config/token.js'
import { json } from 'express'
import sendMail from '../config/sendMail.js'
export const signup = async (req, res) => {
    try {
        const {name, email, password, role} = req.body
        let exist = await User.findOne({email})
        if(exist){
            return res.status(400).json({message: "User already exists"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({message: "Enter Valid Email Address"});
        }
        if(!password || typeof password !== "string"){
            return res.status(400).json({message: "Password is required"});
        }
        if(password.length < 8){
            return res.status(400).json({message: "Enter Strong Password"});
        }
        let hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role
        })
        let token = await gentoken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure:false,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(201).json(user)
    }
    catch(error){
        res.status(500).json({message: `SignUp Error ${error}`})
    }
}

export const login = async(req, res)=>{
    try {
        const {email, password} = req.body
        if(!password || typeof password !== "string"){
            return res.status(400).json({message: "Password is required"});
        }
        let user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message: "User Not Found"})
        }
        let isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        let token = await gentoken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure:false,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(201).json(user)
    } catch (error) { 
        return res.status(500).json({message: `Login Error ${error}`})
    }
}

export const logout = async(req, res)=>{
    try {
        res.clearCookie("token");
        return res.status(200).json({message: "Logout Succesfully"})
    } catch (error) {
        return res.status(500).json({message: `Logout Error ${error}`})      
    }
}

export const sendOTP = async (req, res) => {
    try {
        const {email} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message: "User Not Found"})
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        user.resetOtp = otp,
        user.otpExpires = Date.now() + 5 * 60 * 1000,
        user.isOtpVerified = false



        await user.save()
        await sendMail(email, otp)
        return res.status(200).json({
            message: "Otp Sent Succesfully"
        })
    } catch (error) {
        return res.status(500).json({message: `Send Otp Error ${error}`})   
    }
}

export const verifyOTP = async (req, res) => {
    try {
        const {email, otp} = req.body
        const user = await User.findOne({email})
        if(!user || user.resetOtp != otp || user.otpExpires < Date.now()){
            return res.status(404).json({message: "Invalid OTP"})
        }
        user.isOtpVerified = true
        user.resetOtp = undefined,
        user.otpExpires = undefined,

        await user.save()
        return res.status(200).json({
            message: "Otp Verified Succesfully"
        })
    } catch (error) {
        return res.status(500).json({message: `Verify Otp Error ${error}`})   
    }
}

export const resetPassword = async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user || !user.isOtpVerified){
            return res.status(404).json({message: "OTP Verification is Required "})
        }
        const hashPassword = await bcrypt.hash(password, 10)
        user.password = hashPassword,
        user.isOtpVerified = false

        await user.save()

        return res.status(200).json({
            message: "Password Reset Succesfully"
        })
    } catch (error) {
        return res.status(500).json({message: `Reset Password Error ${error}`})    
    }
}


export const googleAuth = async (req, res) => {
    try {
        const {name, email, role} = req.body
        let user = await User.findOne({email})
        if(!user){
            user = await User.create({
                name,
                email,
                role,
                password: "" // explicit: Google users won't have an email/password
            })
        }
        let token = await gentoken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure:false,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(201).json(user)
    } catch (error) {
        return res.status(500).json({message: `Google Auth Error ${error}`})      
    }
}
