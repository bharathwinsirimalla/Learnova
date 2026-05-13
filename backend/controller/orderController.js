import razorpay from "razorpay"
import dotenv from "dotenv"
import Course from "../model/coursemodel.js"
import User from "../model/usermodel.js"
dotenv.config()


const RazorPayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})


export const RazorpayOrder = async (req, res) => {
    try {
        const {courseId} = req.body
        const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({message: "Course is not found"})
        }
        const amountPaise = Math.round(Number(course.price) * 100)
        if (!Number.isFinite(amountPaise) || amountPaise < 100) {
            return res.status(400).json({ message: "Course price must be at least ₹1 for paid checkout" })
        }
        const options = {
            amount: amountPaise,
            currency: "INR",
            receipt: `rcpt_${String(courseId).replace(/[^a-zA-Z0-9]/g, "")}`.slice(0, 40),
        }
        const order = await RazorPayInstance.orders.create(options)
        return res.status(200).json(order)
    } catch (error) {
        return res.status(500).json({message: `Failed to create Razorpay Order ${error}`})
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const {courseId, userId, razorpay_order_id} = req.body
        const orderInfo = await RazorPayInstance.orders.fetch(razorpay_order_id)
        if(orderInfo.status === 'paid'){
            const user = await User.findById(userId)
            if(!user){
                return res.status(404).json({message: "User is not found"})
            }
            if(!user.enrolledCourses.includes(courseId)){
                await user.enrolledCourses.push(courseId)
                await user.save()
            }
            const course = await Course.findById(courseId).populate("lectures")
            if(!course.enrolledStudents.includes(userId)){
                await course.enrolledStudents.push(userId)
                await course.save()
            }
            return res.status(200).json({message: "Payment Verified and Enrollment Succesful"})
        }
        else{
            return res.status(400).json({message: "Payment Failed "})
        }
    } catch (error) {
        return res.status(500).json({message: `Internal Server Error During Payment Verification ${error}`})
    }
}