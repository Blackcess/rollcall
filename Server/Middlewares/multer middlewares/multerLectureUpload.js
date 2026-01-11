import multer from "multer";
import fs from "fs";
import path from "path";
import { DomainError } from "../../Domain Errors/Grades Module Errors/domainErrors.js";

const MAX_SIZE = 20 * 1024 * 1024; // 10MB

// Accepted mime types
const allowedMime = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/png",
  "image/jpeg"
];

export const lectureFileUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const { sessionId } = req.params;
      const dir = path.join("uploads", "lecture-files", String(sessionId));

      // create folder if it doesn’t exist
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const safeName = file.originalname.replace(/\s+/g, "_");
      cb(null, `${timestamp}_${safeName}`);
    }
  }),

  limits: { fileSize: MAX_SIZE },

  fileFilter: (req, file, cb) => {
    if (!allowedMime.includes(file.mimetype)) {
      return cb(DomainError.invalid("UNSUPPORTED_FILE_TYPE", 400));
    }
    cb(null, true);
  }
});
