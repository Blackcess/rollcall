import { connection } from "../../../../../database connections/databaseConnect.js";

export const ClassRosterRepo = {
  async findStudents({ classId, semester }) {
    const sql = `
        SELECT 
        s.id AS student_id,
        s.roll_number,
        s.student_name
      FROM all_students s
      JOIN student_semester_enrollments se
        ON se.student_id = s.id
      WHERE se.class_id = ?
        AND se.semester_number = ?
    `;
    const [rows] = await connection.query(sql, [
      classId,
      semester
    ]);
    return rows;
  }
};
