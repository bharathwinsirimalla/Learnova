import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../model/usermodel.js"


export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password")
        if(!user){
            return res.status(404).json({message: "User not Found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message: `Get current User error ${error}`})
    }
}

export const getEnrolledCourses = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate({
            path: "enrolledCourses",
            select: "title category thumbnail price reviews subTitle isPublished lectures",
        })
        if (!user) {
            return res.status(404).json({ message: "User not Found" })
        }
        const list = Array.isArray(user.enrolledCourses) ? user.enrolledCourses : []
        const courses = list.filter((doc) => doc && typeof doc === "object" && doc._id)
        return res.status(200).json(courses)
    } catch (error) {
        return res.status(500).json({ message: `Failed to load enrolled courses ${error}` })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const {description, name, removePhoto} = req.body;

        const updateData = {
            name,
            description
        }

        if(req.file){
            const photoUrl = await uploadOnCloudinary(req.file.path)

            if (!photoUrl) {
                return res.status(500).json({message: "Profile photo upload failed"})
            }

            updateData.photoUrl = photoUrl
        } else if (removePhoto === "true") {
            updateData.photoUrl = ""
        }

        const user = await User.findByIdAndUpdate(userId, updateData, {
            returnDocument: "after"
        }).select("-password")

        if(!user){
            return res.status(404).json({message: "User not Found"})
        }
        await user.save()
        return res.status(200).json(user)
    } catch (error) {
        console.error("Update Profile Error:", error)
        const message = error?.http_code === 403
            ? "Cloudinary rejected the upload. Please check CLOUDINARY_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env."
            : `Update Profile Error ${error.message || error}`

        return res.status(500).json({message})
    }
}
