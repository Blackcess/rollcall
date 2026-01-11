import { LectureSessionService } from "../../../Data Models/Class Module Models/lecture session module/lectureSessionService.js";
import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors.js";

export async function getSessionsByDateController(req, res) {
  try {
    const { classId,date } = req.params;
    if(!classId || !date){
        throw DomainError.invalid("INVALID_REQ_PARAMETER")
    }

    const session = await LectureSessionService.listSessionsByDate(Number(classId), date);

    return res.status(200).json({ status: true, data: session });

  } catch (err) {
    if (err instanceof DomainError) {
      return res.status(err.status).json({ status: false, message: err.message });
    }

    console.error("[getSession]", err);
    res.status(500).json({ status: false, message: "Failed to fetch session" });
  }
}
