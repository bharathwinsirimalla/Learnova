import express from "express"
import isAuth from "../middleware/isAuth.js"
import { createReview, getRecentReviews, getReviews } from "../controller/reviewController.js"
const reviewRouter = express.Router()

reviewRouter.post("/createreview", isAuth, createReview)
reviewRouter.get("/getreviews/:courseId", getReviews)
reviewRouter.get("/recent", getRecentReviews)
export default reviewRouter

