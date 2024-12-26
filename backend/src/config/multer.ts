import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

// Map of allowed file types and their extensions
const FILE_TYPE_MAP: { [key: string]: string } = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/avif": "avif",
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    // Resolve the upload path relative to the project root
    const uploadPath = path.resolve(process.cwd(), "public/uploads");

    // Check if the directory exists; if not, create it
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const isValid = FILE_TYPE_MAP[file.mimetype];
    const uploadError: Error | null = isValid
      ? null
      : new Error("Invalid image type");

    cb(uploadError, uploadPath);
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    // Generate a unique filename using the current timestamp
    const fileName = Date.now() + "_" + file.originalname;
    cb(null, fileName);
  },
});

// Initialize multer with the configured storage
const upload = multer({ storage: storage });

// Export the configured upload middleware
export default upload;
