import express from "express";
import { authenticationMiddleware } from "../../../Middlewares/authenticationMiddleware.js";
import { attachUserRoles } from "../../../Middlewares/attachRolesMiddleWare.js";
import { requireRole } from "../../../Middlewares/recquireRole.middleware.js";

import { getTodayTimetableController } from "../../../Data Controllers/ADMIN panel controller/admin class controllers/admin attendance controllers/getTodayTimetable.controller.js";
import { getStudentsForClassController } from "../../../Data Controllers/ADMIN panel controller/admin class controllers/admin attendance controllers/getStudentsForClass.controller.js";
import { getTodayAttendanceController } from "../../../Data Controllers/ADMIN panel controller/admin class controllers/admin attendance controllers/getTodayAttendance.controller.js";
import { markAttendanceBulkController } from "../../../Data Controllers/ADMIN panel controller/admin class controllers/admin attendance controllers/markAttendanceBulk.controller.js";


const adminAttendanceRouter = express.Router();

// Apply auth + role guard to ALL routes below
adminAttendanceRouter.use(
  authenticationMiddleware,
  attachUserRoles,
  requireRole(["ADMIN"])
);

// 1. Fetch today's timetable slots for a class
adminAttendanceRouter.get(
  "/class/:classId/semester/:semester/timetable-today",
  getTodayTimetableController
);

// 2. Fetch students roster for class & semester
adminAttendanceRouter.get(
  "/class/:classId/semester/:semester/students",
  getStudentsForClassController
);

// 3. Fetch today's attendance records (already marked)
adminAttendanceRouter.get(
  "/today",
  getTodayAttendanceController
);

// 4. Bulk mark attendance (insert + update)
adminAttendanceRouter.post(
  "/bulk",
  markAttendanceBulkController
);


export default adminAttendanceRouter;
