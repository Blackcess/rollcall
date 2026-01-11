import { connection } from "../../../database connections/databaseConnect.js";
import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors.js";
import { LectureSessionService } from "./lectureSessionService.js";

export const LectureCommentService = {
  /**
   * Student adds a comment
   */
  async addComment({ sessionId, studentId, commentText }) {
    if (!commentText || !commentText.trim()) {
      throw DomainError.invalid("COMMENT_REQUIRED", 400);
    }

    // ensure session exists
    const session = await LectureSessionService.getSessionById(sessionId);

    if (session.status === "CLOSED") {
      throw DomainError.invalid("SESSION_CLOSED", 403);
    }

    const [insert] = await connection.query(
      `
      INSERT INTO lecture_comments (session_id, student_id, text)
      VALUES (?, ?, ?)
      `,
      [sessionId, studentId, commentText.trim()]
    );

    if (!insert.insertId) {
      throw DomainError.invalid("COMMENT_NOT_SAVED", 500);
    }

    return LectureCommentService.listComments(sessionId);
  },

  /**
   * Public (Student/Admin) – get comments for a session
   */
  async listComments(sessionId) {
    const [rows] = await connection.query(
      `
      SELECT 
        lc.id,
        lc.text,
        lc.student_id,
        lc.created_at,
        s.roll_number,
        s.student_name
      FROM lecture_comments lc
      JOIN all_students s ON lc.student_id = s.id
      WHERE lc.session_id = ?
      ORDER BY lc.created_at ASC
      `,
      [sessionId]
    );
    return rows;
  },

  /**
   * Optional admin purge/remove
   */
  async deleteComment(commentId) {
    const [del] = await connection.query(
      `DELETE FROM lecture_comments WHERE id = ?`,
      [commentId]
    );
    if (!del.affectedRows) {
      throw DomainError.invalid("COMMENT_NOT_FOUND", 404);
    }
    return true;
  }
};
