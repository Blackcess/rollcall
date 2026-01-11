import express from "express";
import { authenticationMiddleware } from "../../../Middlewares/authenticationMiddleware.js";
import { requireRole } from "../../../Middlewares/recquireRole.middleware.js";
import { attachUserRoles } from "../../../Middlewares/attachRolesMiddleWare.js";

import { getSessionController } from "../../../Data Controllers/Class Module Controllers/Lecture session module/getLectureSession.controller.js";
import { listFilesController } from "../../../Data Controllers/Class Module Controllers/Lecture session module/listFiles.controller.js";
import { addCommentController } from "../../../Data Controllers/Class Module Controllers/Lecture session module/addComment.controller.js";
import { listCommentsController } from "../../../Data Controllers/Class Module Controllers/Lecture session module/listComments.controller.js";
import { getSessionsByDateController } from "../../../Data Controllers/Class Module Controllers/Lecture session module/listSessionsByDay.controller.js";



const studentLectureSessionRouter = express.Router();

// Must be logged in + STUDENT
studentLectureSessionRouter.use(authenticationMiddleware);
studentLectureSessionRouter.use(attachUserRoles);
// studentLectureSessionRouter.use(requireRole(["STUDENT"]));

/**
 * GET /Student/lecture/session/:sessionId
 * Student reads session content (summary/topics/files)
 */
studentLectureSessionRouter.get("/session/:sessionId", getSessionController);

studentLectureSessionRouter.get("/session/:classId/:date", getSessionsByDateController);



/**
 * GET /Student/lecture/session/:sessionId/files
 */
studentLectureSessionRouter.get("/session/:sessionId/files", listFilesController);

studentLectureSessionRouter.get("/session/:sessionId/comments",listCommentsController);

studentLectureSessionRouter.post("/session/:sessionId/comments", addCommentController);

export default studentLectureSessionRouter;
