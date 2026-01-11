import { connection } from "../../../../../database connections/databaseConnect.js";

export const TimetableRepo = {
  async findTodaySlots({ classId, semester, weekday }) {
    const sql = `
      SELECT 
        ts.id,
        ts.start_time,
        ts.end_time,
        ts.is_active AS status,
        sub.id AS subject_id,
        sub.name AS subject_name
      FROM timetable_slots ts
      JOIN subjects sub
        ON ts.subject_id = sub.id
      WHERE ts.class_id = ?
        AND ts.semester = ?
        AND ts.day_of_week = ?
        AND ts.is_active = 1
      ORDER BY ts.start_time
    `;
    const [rows] = await connection.query(sql, [
      classId,
      semester,
      weekday
    ]);
    return rows;
  }
};
