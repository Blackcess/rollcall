import express from "express";
import { authenticationMiddleware } from "../../../Middlewares/authenticationMiddleware.js";
import { requireRole } from "../../../Middlewares/recquireRole.middleware.js";
import { attachUserRoles } from "../../../Middlewares/attachRolesMiddleWare.js";

import { createOrGetSessionController } from "../../../Data Controllers/Class Module Controllers/Lecture session module/createLectureSession.controller.js";
import { getSessionController } from "../../../Data Controllers/Class Module Controllers/Lecture session module/getLectureSession.controller.js";
import { updateSessionController } from "../../../Data Controllers/Class Module Controllers/Lecture session module/updateLectureSession.controller.js";
import { closeSessionController } from "../../../Data Controllers/Class Module Controllers/Lecture session module/closeSession.controller.js";
import { uploadFileController } from "../../../Data Controllers/Class Module Controllers/Lecture session module/uploadFile.controller.js";
import { listFilesController } from "../../../Data Controllers/Class Module Controllers/Lecture session module/listFiles.controller.js";
import { lectureFileUpload } from "../../../Middlewares/multer middlewares/multerLectureUpload.js";
import { listCommentsController } from "../../../Data Controllers/Class Module Controllers/Lecture session module/listComments.controller.js";
import { deleteCommentController } from "../../../Data Controllers/Class Module Controllers/Lecture session module/deleteComment.controller.js";

const lectureSessionRouter = express.Router();

// MUST be logged in and ADMIN
lectureSessionRouter.use(authenticationMiddleware);
lectureSessionRouter.use(attachUserRoles);
lectureSessionRouter.use(requireRole(["ADMIN"]));

/**
 * POST /Admin/lecture/session/ensure
 * Create a new session or fetch existing
 */
lectureSessionRouter.post("/lecture/session/ensure", createOrGetSessionController);

/**
 * GET /Admin/lecture/session/:sessionId
 * Fetch a session by ID
 */
lectureSessionRouter.get("/lecture/session/:sessionId", getSessionController);

/**
 * PUT /Admin/lecture/session/:sessionId
 * Update summary/topics/notes
 */
lectureSessionRouter.put("/lecture/session/:sessionId", updateSessionController);

/**
 * POST /Admin/lecture/session/:sessionId/close
 * Close a session
 */
lectureSessionRouter.post("/lecture/session/:sessionId/close", closeSessionController);

/**
 * POST /Admin/lecture/session/:sessionId/files
 * Attach a file URL
 */
lectureSessionRouter.post("/lecture/session/:sessionId/files",lectureFileUpload.single("file"), uploadFileController);

/**
 * GET /Admin/lecture/session/:sessionId/files
 * List session resources
 */
lectureSessionRouter.get("/lecture/session/:sessionId/files", listFilesController);

lectureSessionRouter.get("/lecture/session/:sessionId/comments", listCommentsController);

// optional moderation
// lectureSessionRouter.delete("/lecture/session/comment/:commentId", deleteCommentController);

export default lectureSessionRouter;


