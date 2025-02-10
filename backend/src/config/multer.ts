import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";


const FILE_TYPE_MAP: { [key: string]: string } = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/avif": "avif",
};

const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
   
    const uploadPath = path.resolve(process.cwd(), "public/uploads");

  
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

    const fileName = Date.now() + "_" + file.originalname;
    cb(null, fileName);
  },
});


const upload = multer({ storage: storage });

export default upload;