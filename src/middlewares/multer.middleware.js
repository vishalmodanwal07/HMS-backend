import multer from "multer";
import path from "path";

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    // sanitize + unique name
    const safeName = file.originalname
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "");
    cb(null, Date.now() + "-" + safeName);
  }
});

// Multer instance with validation
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf", "image/png", "image/jpeg"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only PDF, PNG, JPG files are allowed"));
  }
});
