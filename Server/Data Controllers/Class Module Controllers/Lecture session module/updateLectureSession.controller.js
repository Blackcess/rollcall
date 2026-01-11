import { LectureSessionService } from "../../../Data Models/Class Module Models/lecture session module/lectureSessionService.js";
import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors.js";

export async function updateSessionController(req, res) {
  try {
    const { sessionId } = req.params;
    const { summary, topics, extraNotes } = req.body;
    if(!sessionId){
        throw DomainError.invalid("INVALID_REQ_PARAMETER")
    }

    const session = await LectureSessionService.updateSession(
      Number(sessionId),
      { summary, topics, extraNotes, updatedBy: req.user.id }
    );

    return res.status(200).json({ status: true, data: session });

  } catch (err) {
    if (err instanceof DomainError) {
      return res.status(err.status).json({ status: false, message: err.message });
    }

    console.error("[updateSession]", err);
    res.status(500).json({ status: false, message: "Failed to update session" });
  }
}
