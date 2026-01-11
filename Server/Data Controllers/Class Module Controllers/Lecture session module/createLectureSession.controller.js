import { LectureSessionService } from "../../../Data Models/Class Module Models/lecture session module/lectureSessionService.js";
import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors.js";

export async function createOrGetSessionController(req, res) {
  try {
    const {
      slotId,
      classId,
      semester,
      subjectId,
      startTime,
      endTime
    } = req.body;

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    if(!slotId ||!classId || !semester || !subjectId || !startTime ){
        throw DomainError.invalid("INVALID_PARAMETERS_IN_BODY")
    }

    const session = await LectureSessionService.ensureSession({
      slotId,
      classId,
      semester,
      subjectId,
      date: today,
      startTime,
      endTime,
      createdBy: req.user.id
    });

    return res.status(200).json({ status: true, data: session });

  } catch (err) {
    if (err instanceof DomainError) {
      return res.status(err.status).json({ status: false, message: err.message });
    }

    console.error("[createOrGetSession]", err);
    res.status(500).json({ status: false, message: "Failed to create lecture session" });
  }
}
