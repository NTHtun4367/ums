import { v2 as cloudinary } from "cloudinary";
import { ENV } from "../utils/env";

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (fileStr: string, folder: string) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: `ums/${folder}`,
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

export default cloudinary;
