import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinaryConfig.js"; // ✅ Import Cloudinary config

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads", // ✅ Cloudinary folder
    allowed_formats: ["jpg", "jpeg", "png", "webp"], // ✅ Allowed file formats
    public_id: (req, file) => file.originalname.split(".")[0], // ✅ Ensures no extra extensions
  },
});

const upload = multer({ storage });

export default upload;
