import Course from "../model/coursemodel.js";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const MAX_AI_KEYWORDS = 8;

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeKeyword = (value) =>
  String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 60);

const uniqueKeywords = (keywords) => {
  const seen = new Set();
  return keywords
    .map(normalizeKeyword)
    .filter((keyword) => {
      const key = keyword.toLowerCase();
      if (!key || seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .slice(0, MAX_AI_KEYWORDS);
};

const parseGeminiKeywords = (text) => {
  if (!text) {
    return [];
  }

  const match = text.match(/\[[\s\S]*\]/);
  if (!match) {
    return [];
  }

  try {
    const parsed = JSON.parse(match[0]);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
};

const getAiSearchKeywords = async (input) => {
  if (!process.env.GEMINI_API_KEY || typeof fetch !== "function") {
    return [];
  }

  const prompt = [
    "You help an LMS search engine understand student intent.",
    "Return only a JSON array of short search keywords or phrases.",
    "Include course topics, tools, skill names, category words, and likely level words.",
    "Do not include explanations, markdown, or objects.",
    `Student search: "${input}"`,
  ].join("\n");

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 120,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini request failed with status ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join("") || "";
    return parseGeminiKeywords(text);
  } catch (error) {
    console.warn(`Gemini search expansion skipped: ${error.message}`);
    return [];
  }
};

const findPublishedCoursesMatching = async (keywords) => {
  const searchTerms = uniqueKeywords(Array.isArray(keywords) ? keywords : [keywords]);
  const textFields = ["title", "subTitle", "description", "category", "level"];

  if (!searchTerms.length) {
    return [];
  }

  const conditions = searchTerms.flatMap((keyword) => {
    const safe = escapeRegex(keyword);
    return textFields.map((field) => ({
      [field]: { $regex: safe, $options: "i" },
    }));
  });

  return Course.find({
    isPublished: true,
    $or: conditions,
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

    const aiKeywords = await getAiSearchKeywords(trimmed);
    const courses = await findPublishedCoursesMatching([trimmed, ...aiKeywords]);

    return res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: `Search error: ${error.message}`,
    });
  }
};
