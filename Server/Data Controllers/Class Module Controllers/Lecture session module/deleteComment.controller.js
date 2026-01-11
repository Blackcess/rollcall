import { LectureCommentService } from "../../../Data Models/Class Module Models/lecture session module/lectureCommentService.js";
import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors.js";

export async function deleteCommentController(req, res) {
  try {
    const { commentId } = req.params;
    if (!commentId){
        throw DomainError.invalid("INVALID_REQ_PARAMETERS")
    }

    await LectureCommentService.deleteComment(Number(commentId));

    return res.status(200).json({ status: true, message: "Comment removed" });
  } catch (err) {
    if(err instanceof DomainError){
        res.status(err.status).json({status:false,message: err.message})
    }
    console.error(err);
    res.status(500).json({ status: false, message: err.message });
  }
}
