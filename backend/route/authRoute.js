import express from "express"
import {signup, login, logout, sendOTP, verifyOTP, resetPassword, googleAuth} from "../controller/authController.js"


const authRouter = express.Router();

authRouter.post("/signup", signup)
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.post("/sendotp", sendOTP)
authRouter.post("/verifyotp", verifyOTP)
authRouter.post("/resetpassword", resetPassword)
authRouter.post("/googleauth", googleAuth)


export default authRouter
