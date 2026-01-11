import { AttendanceService } from "../../../../Data Models/ADMIN panel Models/Class Service/admin attendance service/attendanceService.js";
import { DomainError } from "../../../../Domain Errors/Grades Module Errors/domainErrors.js";
import { handle } from "./errorhelper.js";
export async function markAttendanceBulkController(req, res) {
  try {
    const { class_id, semester,subject_id,start_time, records} = req.body;
      console.log("Debugging Information From the CLIENT_API LAYER ",req.body)
    if(!subject_id || !class_id || !semester || !start_time){
      throw DomainError.invalid("INVALID_PARAMETERS")
    }

    const result = await AttendanceService.bulkMark({
      actorId: req.user.id,
      classId: Number(class_id),
      semester: Number(semester),
      subject_id:Number(subject_id),
      start_time,
      records
    });

    res.status(200).json({ status: true, ...result });
  } catch (err) {
    handle(err, res);
  }
}
