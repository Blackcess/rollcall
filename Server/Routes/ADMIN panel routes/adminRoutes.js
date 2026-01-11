import AdminClassController from "../../Data Controllers/ADMIN panel controller/admin class controllers/adminClassController.js";
import { attachUserRoles } from "../../Middlewares/attachRolesMiddleWare.js";
import { requireRole } from "../../Middlewares/recquireRole.middleware.js";
import AdminEnrollmentController from "../../Data Controllers/ADMIN panel controller/admin class controllers/studentClassEnrollmentController.js";
import { StudentSemesterEnrollmentController } from "../../Data Controllers/ADMIN panel controller/admin class controllers/studentSemesterEnrollmentController.js";
import { Router } from "express";
import { StudentSubjectEnrollmentController } from "../../Data Controllers/ADMIN panel controller/admin class controllers/studentSubjectEnrollmentController.js";
import { AdminSemesterController } from "../../Data Controllers/ADMIN panel controller/admin class controllers/adminSemesterController.js";
import AdminTimetableController from "../../Data Controllers/ADMIN panel controller/admin class controllers/adminTimetableController.js";

const adminPanelRoutes= Router()
adminPanelRoutes.use(attachUserRoles)
adminPanelRoutes.use(requireRole(["ADMIN"]))

// get all classes
adminPanelRoutes.get(
  "/classes/all",
  AdminClassController.getAllClasses
);
//get class details
adminPanelRoutes.get(
  "/classes/details",
  AdminClassController.getClassDetails
);
// student_class_enrollment logic
adminPanelRoutes.post(
  "/classes",
  AdminClassController.createClass
);

adminPanelRoutes.patch(
  "/classes/:classId",
  AdminClassController.updateClass
);

adminPanelRoutes.delete(
  "/classes/:classId",
  AdminClassController.archiveClass
);

adminPanelRoutes.post(
  "/enrollments/class",
  AdminEnrollmentController.enrollStudent
);

adminPanelRoutes.delete(
  "/enrollments/class",
  AdminEnrollmentController.unenrollStudent
);
adminPanelRoutes.get("/enrollments/class",
  AdminEnrollmentController.getClassList
);
// student_semester_enrollment logic
adminPanelRoutes.post(
  "/enrollments/semester/:classId/:studentId",
  StudentSemesterEnrollmentController.enrollStudent
);
adminPanelRoutes.patch(
  "/enrollments/semester/:semesterEnrollmentId/complete",
  StudentSemesterEnrollmentController.completeSemester
);
// adminPanelRoutes.get(
//   "/enrollments/semester/active/:studentId/:classId",
//   StudentSemesterEnrollmentController.getActiveSemester
// );
adminPanelRoutes.get(
  "/enrollments/semester/history/:studentId/:classId",
  StudentSemesterEnrollmentController.listSemesterHistory
);

// Student Semester Enrollment Logic

adminPanelRoutes.post(
  "/enrollments/subject/manual",
  StudentSubjectEnrollmentController.enrollManual
)
adminPanelRoutes.post(
  "/enrollments/subject/mandatory",
  StudentSubjectEnrollmentController.enrollAutomatic
)
adminPanelRoutes.get(
  "/enrollments/subject/semester/:semesterEnrollmentId",
  StudentSubjectEnrollmentController.listSubjects
)

// Admin semester controller (For adding students to semestersand other helper routes)
adminPanelRoutes.get("/semester/context",
  AdminSemesterController.getContext
)
adminPanelRoutes.get("/semester/eligible-students",
  AdminSemesterController.getEligibleStudents
)

// Admin Timetable Logic
adminPanelRoutes.get(
  "/classes/:classId/semesters/:semester/timetable",
  AdminTimetableController.getTimetable
);
adminPanelRoutes.post(
  "/classes/:classId/semesters/:semester/timetable/slots",
  AdminTimetableController.createSlot
);
adminPanelRoutes.patch(
  "/classes/:classId/semesters/:semester/timetable/slots/:slotId",
  AdminTimetableController.updateSlot
);
adminPanelRoutes.delete(
  "/classes/:classId/semesters/:semester/timetable/slots/:slotId",
  AdminTimetableController.deleteSlot
);
adminPanelRoutes.post(
  "/classes/:classId/semesters/:semester/timetable/slots/:slotId/restore",
  AdminTimetableController.restoreSlot
);


export default adminPanelRoutes;

