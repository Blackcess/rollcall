import { getClassTimetable } from "../../../Data Models/Class Module Models/Timetable Models/getTimetable.js";
import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors.js";


export async function getTimetableController(req, res) {
  try {
    const {
      classId,
      semester,
      lectureType,
      dayOfWeek,
      includeInactive
    } = req.query;
    
    let user = req.user

  if (user.roles.includes("STUDENT")) {
    if (user.class_id && user.class_id !== parseInt(classId)) {
      // console.log("User details are ", user.class_id, classId)
      throw new DomainError(
        "CANNOT ACCESS OTHER CLASS TIMETABLE",
        "FORBIDDEN",
        403
      );
    }
  }


    // Normalize inputs (controller-level only)
    const timetable = await getClassTimetable({
      classId: Number(classId),
      semester: Number(semester),
      lectureType,
      dayOfWeek,
      includeInactive: includeInactive === "true"
    });

    return res.status(200).json({
      status: true,
      data: timetable
    });

  } catch (err) {
    // Domain-aware error mapping
    if (err instanceof DomainError) {
      return res.status(err.status).json({
        status: false,
        error: err.code,
        message: err.message
      });
    }

    // Unknown / infrastructure error
    console.error("[TimetableController]", err);

    return res.status(500).json({
      status: false,
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch timetable"
    });
  }
}

// export { getTimetableController };