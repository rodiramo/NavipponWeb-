import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load .env variables

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "CLOUD_NAME_MISSING",
  api_key: process.env.CLOUDINARY_API_KEY || "API_KEY_MISSING",
  api_secret: process.env.CLOUDINARY_API_SECRET || "API_SECRET_MISSING",
});

console.log("✅ Cloudinary Config:", cloudinary.config());

export default cloudinary;
