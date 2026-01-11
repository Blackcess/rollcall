import { AttendanceService } from "../../../../Data Models/ADMIN panel Models/Class Service/admin attendance service/attendanceService.js";
import { DomainError } from "../../../../Domain Errors/Grades Module Errors/domainErrors.js";
import { handle } from "./errorhelper.js";
export async function getTodayAttendanceController(req, res) {
  try {
    const { classId, semester } = req.query;
    if(!classId,!semester){
      throw DomainError.invalid("INVALID_QUERY_PARAMETERS")
    }
    const data = await AttendanceService.getToday({
      classId: Number(classId),
      semester: Number(semester)
    });

    res.status(200).json({ status: true, data });
  } catch (err) {
    handle(err, res);
  }
}
