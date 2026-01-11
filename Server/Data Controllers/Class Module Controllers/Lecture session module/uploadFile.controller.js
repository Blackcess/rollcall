import { LectureFileService } from "../../../Data Models/Class Module Models/lecture session module/lectureFileService.js";
import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors.js";

export async function uploadFileController(req, res) {
  try {
    const { sessionId } = req.params;

    if (!req.file) {
      throw DomainError.invalid("FILE_REQUIRED", 400);
    }

    const fileName = req.file.originalname;
    const storedName = req.file.filename;
    const fileUrl = `/uploads/lecture-files/${sessionId}/${storedName}`;

    const files = await LectureFileService.addFile({
      sessionId: Number(sessionId),
      fileName,
      fileUrl,
      uploadedBy: req.user.id
    });

    return res.status(200).json({ status: true, data: files });

  } catch (err) {
    console.error("[uploadFile]", err);
    return res.status(err.statusCode || 500).json({
      status: false,
      message: err.message || "File upload failed"
    });
  }
}
