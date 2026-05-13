import Course from "../model/coursemodel.js";

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findPublishedCoursesMatching = async (keyword) => {
  const safe = escapeRegex(keyword);
  return Course.find({
    isPublished: true,
    $or: [
      { title: { $regex: safe, $options: "i" } },
      { subTitle: { $regex: safe, $options: "i" } },
      { description: { $regex: safe, $options: "i" } },
      { category: { $regex: safe, $options: "i" } },
      { level: { $regex: safe, $options: "i" } },
    ],
  });
};

export const searchCourses = async (req, res) => {
  try {
    const { input } = req.body;
    const trimmed = typeof input === "string" ? input.trim() : "";

    if (!trimmed) {
      return res.status(400).json({
        message: "Input is required",
      });
    }

    const courses = await findPublishedCoursesMatching(trimmed);
    return res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: `Search error: ${error.message}`,
    });
  }
};
