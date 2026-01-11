import { ClassRosterService } from "../../../../Data Models/ADMIN panel Models/Class Service/admin attendance service/classRoasterService.js";
import { handle } from "./errorhelper.js";

export async function getStudentsForClassController(req, res) {
  try {
    const { classId, semester } = req.params;

    const data = await ClassRosterService.getStudents({
      classId: Number(classId),
      semester: Number(semester)
    });

    res.status(200).json({ status: true, data });
  } catch (err) {
    handle(err, res);
  }
}
