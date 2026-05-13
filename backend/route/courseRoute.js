import express from "express"
import { createCourse, createLecture, editCourse, editLecture, getCourseById, getCourseLecture, getCreatorCourses, getLectureById, getPublishedCourses, getViewCourseById, removeCourse, removeLecture } from "../controller/courseController.js"
import isAuth from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"
import { searchCourses } from "../controller/searchController.js"

const courseRouter = express.Router()

courseRouter.post("/create", isAuth, createCourse)  
courseRouter.get("/getpublished", getPublishedCourses)
courseRouter.get("/getcreator", isAuth, getCreatorCourses)
courseRouter.post("/editcourse/:courseId", isAuth, upload.single("thumbnail"),editCourse)
courseRouter.get("/getcoursebyid/:courseId", isAuth, getCourseById)
courseRouter.get("/viewcourse/:courseId", getViewCourseById)
courseRouter.delete("/remove/:courseId", isAuth, removeCourse)


courseRouter.post("/createlecture/:courseId", isAuth, createLecture)
courseRouter.get("/courselecture/:courseId", isAuth, getCourseLecture)
courseRouter.get("/lecture/:lectureId", isAuth, getLectureById)
courseRouter.post("/editlecture/:lectureId", isAuth, upload.single("videoUrl"),editLecture)
courseRouter.post("/removelecture/:lectureId", isAuth, removeLecture)


courseRouter.post("/search", searchCourses)
export default courseRouter
