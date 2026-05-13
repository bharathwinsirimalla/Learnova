import Course from "../model/coursemodel.js"
import Review from "../model/reviewmodel.js"

export const createReview = async (req, res) => {
    try {
        const { courseId, rating, comment } = req.body
        const userId = req.userId
        const numericRating = Number(rating)
        if (!courseId || !Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({ message: "courseId and rating (1–5) are required" })
        }
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(400).json({ message: "Course not found" })
        }
        const alreadyReviewed = await Review.findOne({ course: courseId, user: userId })
        if (alreadyReviewed) {
            return res.status(400).json({ message: "You have already reviewed this course" })
        }
        const review = await Review.create({
            course: courseId,
            user: userId,
            rating: numericRating,
            comment: comment?.trim() || "",
        })
        course.reviews.push(review._id)
        await course.save()
        const populated = await Review.findById(review._id).populate("user", "name email photoUrl")
        return res.status(200).json(populated)
    } catch (error) {
        res.status(500).json({ message: `Create Review Error ${error}` })
    }
}

export const getReviews = async (req, res) => {
    try {
        const { courseId } = req.params
        if (!courseId) {
            return res.status(400).json({ message: "courseId is required" })
        }
        const reviews = await Review.find({ course: courseId })
            .populate("user", "name email photoUrl")
            .sort({ reviewedAt: -1 })
        return res.status(200).json(reviews)
    } catch (error) {
        res.status(500).json({ message: `Get Reviews Error ${error}` })
    }
}

export const getRecentReviews = async (req, res) => {
    try {
        const rawLimit = Number(req.query.limit)
        const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 24) : 8
        const reviews = await Review.find()
            .populate("user", "name email photoUrl")
            .populate({
                path: "course",
                match: { isPublished: true },
                select: "title thumbnail category _id",
            })
            .sort({ reviewedAt: -1 })
            .limit(limit * 3)

        const visible = reviews.filter((doc) => doc.course)
        return res.status(200).json(visible.slice(0, limit))
    } catch (error) {
        res.status(500).json({ message: `Get Recent Reviews Error ${error}` })
    }
}
