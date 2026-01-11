import { connection } from "../../../../../database connections/databaseConnect.js";

export const AttendanceRepo = {
  async findTodayRecords({ classId, semester, date }) {
    const sql = `
      SELECT 
        student_id,
        subject_id,
        start_time,
        status
      FROM attendance
      WHERE class_id = ?
        AND semester = ?
        AND date = ?
    `;
    const [rows] = await connection.query(sql, [
      classId, semester, date
    ]);
    return rows;
  },

  async bulkUpsert({ classId, semester, date, actorId, records,subject_id,start_time }) {
    const sql = `
      INSERT INTO attendance (
        user_id, student_id, subject_id, date, status, start_time, semester, class_id
      ) VALUES ?
      ON DUPLICATE KEY UPDATE
        status = VALUES(status),
        user_id = VALUES(user_id);
    `;

    const values = records.map(r => [
      actorId,
      r.student_id,
      subject_id,
      date,
      r.status,
      start_time,
      semester,
      classId
    ]);

    const [result] = await connection.query(sql, [values]);
    return result;
  }
};
