import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    // For Google-authenticated users we won't have a password.
    // Email/password signup and reset flows still enforce password via controller validation.
    password:{
        type:String,
        required: false,
        default: ""
    },
    role: {
        type: String,
        enum: ["student", "educator"],
        required: true
    },
    photoUrl: {
        type: String,
        default: ""
    },
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
        }
    ],
    resetOtp:{
        type: String
    },
    otpExpires:{
        type: Date
    },
    isOtpVerified:{
        type: Boolean,
        default: false
    }
},{timestamps:true})

const User = mongoose.model("User", userSchema)

export default User
