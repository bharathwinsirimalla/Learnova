import uploadOnCloudinary from "../config/cloudinary.js"
import Course from "../model/coursemodel.js"
import Lecture from "../model/lecturemodel.js"

const parseListField = (value) => {
    if(value === undefined){
        return undefined
    }
    if(Array.isArray(value)){
        return value.map((item) => String(item).trim()).filter(Boolean)
    }
    try {
        const parsedValue = JSON.parse(value)
        if(Array.isArray(parsedValue)){
            return parsedValue.map((item) => String(item).trim()).filter(Boolean)
        }
    } catch {
        // Fall back to newline-separated text from multipart form data.
    }
    return String(value)
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean)
}



export const createCourse = async (req, res) => {
    try{
        const {title, category} = req.body
        if(!title || !category){
            return res.status(400).json({message: "Title and category are required"})
        }
        const course = await Course.create({
            title,
            category,
            creator: req.userId
        })
        return res.status(201).json(course)
    }
    catch(error){
        return res.status(500).json({message: `Create Course error ${error}`})
    }
}

export const getPublishedCourses = async (req, res) => {
    try {
        const courses = await Course.find({isPublished:true})
        if(!courses){
            return res.status(400).json({message: "Courses not Found"})
        }
        return res.status(200).json(courses)
    } catch (error) {
        return res.status(500).json({message: `Failed to get isPublished Courses ${error}`} )
    }
}

export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.userId
        const courses = await Course.find({creator: userId})

        if(!courses){
            return res.status(400).json({message: "Courses not Found"})
        }
        return res.status(200).json(courses)
    } catch (error) {
        return res.status(500).json({message: `Failed to get Creator Courses ${error}`} )
    }
}

export const editCourse  = async (req, res) => {
    try {
        const {courseId} = req.params
        const {
            title,
            subTitle,
            description,
            category,
            level,
            isPublished,
            price,
            whatYouWillLearn,
            requirements,
            whoIsThisCourseFor,
            perks
        } = req.body
        let thumbnail
        if(req.file){
            thumbnail = await uploadOnCloudinary(req.file.path)
        }
        const course = await Course.findById(courseId)
        if(!course){
            return res.status(400).json({message: "Courses not Found"})
        }
        const updateData = {
            title,
            subTitle,
            description,
            category,
            level,
            isPublished,
            price,
            whatYouWillLearn: parseListField(whatYouWillLearn),
            requirements: parseListField(requirements),
            whoIsThisCourseFor: parseListField(whoIsThisCourseFor),
            perks: parseListField(perks)
        }
        if(thumbnail){
            updateData.thumbnail = thumbnail
        }
        Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key])

        const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, {returnDocument: "after"})
        return res.status(200).json(updatedCourse)
    } catch (error) {
        return res.status(500).json({message: `Failed to Edit Creator Courses ${error}`} )
    }
} 

export const getCourseById  = async (req, res) => {
    try {
        const {courseId} = req.params
        const course = await Course.findById(courseId)
        if(!course){
            return res.status(400).json({message: "Courses not Found"})
        }
        return res.status(200).json(course)
    } catch (error) {
        return res.status(500).json({message: `Failed to Get Course By Id${error}`} )
    }
} 

export const getViewCourseById  = async (req, res) => {
    try {
        const {courseId} = req.params
        const course = await Course.findById(courseId)
            .populate("lectures")
            .populate("creator", "name email photoUrl description role")
        if(!course){
            return res.status(400).json({message: "Courses not Found"})
        }
        const creatorId = course.creator?._id || course.creator
        const otherCourses = creatorId
            ? await Course.find({
                creator: creatorId,
                isPublished: true,
                _id: {$ne: courseId}
            }).limit(4)
            : []

        return res.status(200).json({course, otherCourses})
    } catch (error) {
        return res.status(500).json({message: `Failed to Get View Course By Id ${error}`} )
    }
} 


export const removeCourse  = async (req, res) => {
    try {
        const {courseId} = req.params 
        const course = await Course.findById(courseId)
        if(!course){
            return res.status(400).json({message: "Courses not Found"})
        }
        await Course.findByIdAndDelete(courseId)
        return res.status(200).json({
            message: "Course Removed"
        })
    } catch (error) {
        return res.status(500).json({message: `Failed to Delete Course  ${error}`} )
    }
} 


//For Lecture

export const createLecture = async (req, res) => {
    try {
        const {lectureTitle} = req.body
        const {courseId} = req.params
        if(!lectureTitle || !courseId){
            return res.status(400).json({message: "Lecture Title is required"})
        }
        const course = await Course.findById(courseId)
        if(!course){
            return res.status(400).json({message: "Courses not Found"})
        }

        const lecture = await Lecture.create({lectureTitle})
        course.lectures.push(lecture._id)
        await course.save()
        await course.populate("lectures")

        return res.status(201).json({lecture, course})
    } catch (error) {
        return res.status(500).json({message: `Create Lecture error ${error}`})
    }
}


export const getCourseLecture = async (req, res) => {
    try {
        const {courseId} = req.params
        const course = await Course.findById(courseId)
        if(!course){
            return res.status(400).json({message: "Courses not Found"})
        }
        await course.populate("lectures")

        return res.status(200).json(course)
    } catch (error) {
        return res.status(500).json({message: `Failed to get Course Lecture ${error}`})
    }
}

export const getLectureById = async (req, res) => {
    try {
        const {lectureId} = req.params
        const lecture = await Lecture.findById(lectureId)
        if(!lecture){
            return res.status(400).json({message: "Lecture not Found"})
        }
        return res.status(200).json(lecture)
    } catch (error) {
        return res.status(500).json({message: `Failed to get Lecture ${error}`})
    }
}

export const editLecture = async (req, res) => {
    try {
        const {lectureId} = req.params
        const {isPreviewFree, lectureTitle} = req.body
        const lecture = await Lecture.findById(lectureId)
        if(!lecture){
            return res.status(400).json({message: "Lecture not Found"})
        }
        let videoUrl
        if(req.file){
            videoUrl = await uploadOnCloudinary(req.file.path)
            lecture.videoUrl = videoUrl
        }
        if(lectureTitle){
            lecture.lectureTitle = lectureTitle
        }
        if(isPreviewFree !== undefined){
            lecture.isPreviewFree = isPreviewFree === true || isPreviewFree === "true"
        }
        await lecture.save()
        return res.status(200).json(lecture)
    } catch (error) {
        return res.status(500).json({message: `Failed to Edit Lecture error ${error}`})
    }
}


export const removeLecture = async (req, res) => {
    try {
        const {lectureId} = req.params
        const lecture = await Lecture.findById(lectureId)
        if(!lecture){
            return res.status(400).json({message: "Lecture not Found"})
        }
        await Course.updateOne(
            {lectures: lectureId},
            {$pull:{lectures:lectureId}}
        )
        await Lecture.findByIdAndDelete(lectureId)
        return res.status(200).json({message: "Lecture Removed"})
    } catch (error) {
        return res.status(500).json({message: `Failed to Remove Lecture error ${error}`})
    }
}
