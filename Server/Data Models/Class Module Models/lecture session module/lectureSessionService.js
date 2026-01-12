import { connection } from "../../../database connections/databaseConnect.js";
import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors.js";

/**
 * LectureSessionService
 * Encapsulates all DB operations + business rules
 */
export const LectureSessionService = {

  /**
   * Ensure a lecture session exists for today’s slot.
   * If exists, return it; if not, create it.
   */
  async ensureSession({ slotId, classId, semester, subjectId, date, startTime, endTime, createdBy }) {
    // 1. Try find existing
    const [rows] = await connection.query(
      `
      SELECT * FROM lecture_sessions
      WHERE slot_id = ?
        AND date = ?
      LIMIT 1
      `,
      [slotId, date]
    );

    if (rows.length > 0) {
      return rows[0];
    }

    // 2. Insert new ACTIVE session
    const [insert] = await connection.query(
      `
      INSERT INTO lecture_sessions
        (slot_id, class_id, semester, subject_id, date, start_time, end_time, status, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?)
      `,
      [slotId, classId, semester, subjectId, date, startTime, endTime, createdBy]
    );

    if (!insert.insertId) {
      throw DomainError.invalid("FAILED_TO_CREATE_LECTURE_SESSION", 500);
    }

    // Fetch created record
    const [created] = await connection.query(
      `SELECT * FROM lecture_sessions WHERE id = ?`,
      [insert.insertId]
    );

    return created[0];
  },


  /**
   * Get session by ID.
   */
  async getSessionById(sessionId) {
    const [rows] = await connection.query(
      `
      SELECT *
      FROM lecture_sessions
      WHERE id = ?`,
      [sessionId]
    );

    // if (!rows.length) {
    //   throw new DomainError("LECTURE_SESSION_NOT_FOUND", 404);
    // }

    return rows[0];
  },


  /**
   * Get session by slot + date (shared usage).
   */
  async getSessionBySlotAndDate(slotId, date) {
    const [rows] = await connection.query(
      `
      SELECT * FROM lecture_sessions
      WHERE slot_id = ?
        AND date = ?
      LIMIT 1
      `,
      [slotId, date]
    );

    return rows.length ? rows[0] : null;
  },


  /**
   * Update notes/summary/topics.
   * Cannot update if CLOSED.
   */
  async updateSession(sessionId, { summary, topics, extraNotes, updatedBy }) {
    // 1. Check status
    const session = await LectureSessionService.getSessionById(sessionId);

    if (session.status === "CLOSED") {
      throw DomainError.invalid("SESSION_ALREADY_CLOSED", 400);
    }

    // 2. Update
    await connection.query(
      `
      UPDATE lecture_sessions
      SET summary = ?, topics = ?, extra_notes = ?
      WHERE id = ?
      `,
      [summary ?? null, topics ?? null, extraNotes ?? null, sessionId]
    );

    // 3. Return updated
    return LectureSessionService.getSessionById(sessionId);
  },


  /**
   * Close a session.
   * After this no edits/comments allowed.
   */
  async closeSession(sessionId) {
    const session = await this.getSessionById(sessionId);

    if (session.status === "CLOSED") {
      return session; // already closed
    }

    await connection.query(
      `
      UPDATE lecture_sessions
      SET status = 'CLOSED'
      WHERE id = ?
      `,
      [sessionId]
    );

    return this.getSessionById(sessionId);
  },


  /**
   * Gets ALL sessions optionally by class/date/user.
   * (Useful later, not required now)
   */
  async listSessionsByDate(classId, date) {
    const [rows] = await connection.query(
      `
      SELECT ls.*,
      s.name AS subject_name
      FROM lecture_sessions ls
      JOIN subjects s ON s.id = ls.subject_id
      WHERE ls.class_id = ?
        AND ls.date = CURDATE()
      ORDER BY start_time ASC
      `,
      [classId]
    );

    return rows;
  }
};
