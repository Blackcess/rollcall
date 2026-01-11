import { LectureCommentService } from "../../../Data Models/Class Module Models/lecture session module/lectureCommentService.js";
import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors.js";

export async function listCommentsController(req, res) {
  try {
    const { sessionId } = req.params;
    if(!sessionId){
        throw DomainError.invalid("INVALID_REQ_PARAMETER")
    }
    console.log("SessionId for comment get is ",sessionId)

    const comments = await LectureCommentService.listComments(Number(sessionId));

    return res.status(200).json({ status: true, data: comments });

  } catch (err) {
    if (err instanceof DomainError) {
      return res.status(err.status).json({ status: false, message: err.message });
    }
    console.error("[listComments]", err);
    res.status(500).json({ status: false, message: "Failed to load comments" });
  }
}
