import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadDestination = path.resolve(__dirname, "../public")

let storage = multer.diskStorage({
    destination: (req, file,cb)=>{
        cb(null, uploadDestination)
    },
    filename: (req, file, cb)=>{
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const isImage = file.mimetype.startsWith("image/")
        const isVideo = file.mimetype.startsWith("video/")

        if (!isImage && !isVideo) {
            return cb(new Error("Only image and video files are allowed"))
        }

        cb(null, true)
    }
})

export default upload
