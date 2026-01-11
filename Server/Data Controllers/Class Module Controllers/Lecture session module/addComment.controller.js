import { LectureCommentService } from "../../../Data Models/Class Module Models/lecture session module/lectureCommentService.js";
import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors.js";

export async function addCommentController(req, res) {
  try {
    const { sessionId } = req.params;
    const { commentText } = req.body;
    if(!sessionId){
        throw DomainError.invalid("INVALID_REQ_PARAMETERS")
    }

    const updated = await LectureCommentService.addComment({
      sessionId: Number(sessionId),
      studentId: req.user.student_id,
      commentText
    });

    return res.status(200).json({ status: true, data: updated });

  } catch (err) {
    if (err instanceof DomainError) {
      return res.status(err.status).json({ status: false, message: err.message });
    }
    console.error("[addComment]", err);
    res.status(500).json({ status: false, message: "Failed to add comment" });
  }
}
