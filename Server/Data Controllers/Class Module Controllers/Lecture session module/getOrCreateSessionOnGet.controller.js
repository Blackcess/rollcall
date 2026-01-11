import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors";

export async function getOrCreateSessionController(req, res) {
  try {
    const {
      slotId,
      classId,
      semester,
      subjectId,
      startTime,
      endTime
    } = req.query;
    if(!slotId || !classId || !semester || !subjectId || !startTime || !endTime){
        throw DomainError.invalid("INVALID_REQ_PARAMETERS")
    }

    const today = new Date().toISOString().slice(0, 10);

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

    console.error("[getOrCreateSessionController]", err);
    res.status(500).json({ status: false, message: "Failed to ensure session" });
  }
}
