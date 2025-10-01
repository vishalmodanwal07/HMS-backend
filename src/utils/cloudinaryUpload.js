import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { configDotenv } from "dotenv";
configDotenv("./env");

console.log("Cloudinary config check:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "✅ loaded" : "❌ missing",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "✅ loaded" : "❌ missing"
});


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) throw new Error("File path not found");

    // Upload to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // works for pdf, images, etc.
    });

    // Cleanup local file
    if (fs.existsSync(localFilePath)) {
      await fs.promises.unlink(localFilePath);
    }

    return response;
  } catch (error) {
    console.error("Error during Cloudinary upload:", error.message);

    // Cleanup on error
    if (localFilePath && fs.existsSync(localFilePath)) {
      try {
        await fs.promises.unlink(localFilePath);
      } catch (unlinkError) {
        console.error("Error deleting local file:", unlinkError.message);
      }
    }

    return null;
  }
};

export { cloudinary };
