import { TimetableService } from "../../../../Data Models/ADMIN panel Models/Class Service/admin attendance service/attendance timetable services/attendanceTimetableService.js";
import { DomainError } from "../../../../Domain Errors/Grades Module Errors/domainErrors.js";
import { handle } from "./errorhelper.js";

export async function getTodayTimetableController(req, res) {
  try {
    const { classId, semester } = req.params;
    if(!classId || !semester){
      throw DomainError.invalid("INVALID_REQ_PARAMETERS")
    }
    const data = await TimetableService.getTodaySlots({
      classId: Number(classId),
      semester: Number(semester)
    });

    res.status(200).json({ status: true, data });
  } catch (err) {
    handle(err, res);
  }
}
