import { connection } from "../../../database connections/databaseConnect.js";
import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors.js";
import { LectureSessionService } from "./lectureSessionService.js";

export const LectureFileService = {

  /**
   * Add file metadata to session.
   * Assumes file upload already handled externally.
   */
  async addFile({ sessionId, fileName, fileUrl, uploadedBy }) {
    // Ensure session exists & is ACTIVE
    const session = await LectureSessionService.getSessionById(sessionId);

    if (session.status === "CLOSED") {
      throw DomainError.invalid("SESSION_ALREADY_CLOSED", 400);
    }

    const [insert] = await connection.query(
      `
      INSERT INTO lecture_files (session_id, file_name, file_url, uploaded_by)
      VALUES (?, ?, ?, ?)
      `,
      [sessionId, fileName, fileUrl, uploadedBy]
    );

    if (!insert.insertId) {
      throw DomainError.invalid("FAILED_TO_UPLOAD_FILE", 500);
    }

    return LectureFileService.getFiles(sessionId);
  },


  /**
   * List all files in a session.
   */
  async getFiles(sessionId) {
    const [rows] = await connection.query(
      `
      SELECT id, file_name, file_url, uploaded_by, created_at
      FROM lecture_files
      WHERE session_id = ?
      ORDER BY created_at DESC
      `,
      [sessionId]
    );
    return rows;
  },


  /**
   * Optional delete (future)
   */
  async deleteFile(fileId, sessionId) {
    const [deleteResult] = await connection.query(
      `DELETE FROM lecture_files WHERE id = ? AND session_id = ?`,
      [fileId, sessionId]
    );

    if (!deleteResult.affectedRows) {
      throw DomainError.invalid("FILE_NOT_FOUND_OR_NOT_DELETED", 404);
    }

    return true;
  }
};
