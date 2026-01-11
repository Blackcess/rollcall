import { LectureFileService } from "../../../Data Models/Class Module Models/lecture session module/lectureFileService.js";
import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors.js";

export async function listFilesController(req, res) {
  try {
    const { sessionId } = req.params;
    if(!sessionId){
        throw DomainError.invalid("INVALID_REQ_PARAMETERS")
    }
    console.log("uadighdisghdh",sessionId)
    const files = await LectureFileService.getFiles(Number(sessionId));

    return res.status(200).json({ status: true, data: files });

  } catch (err) {
    if (err instanceof DomainError) {
      return res.status(err.status).json({ status: false, message: err.message });
    }
    console.error("[listFiles]", err);
    res.status(500).json({ status: false, message: "Failed to load session files" });
  }
}
