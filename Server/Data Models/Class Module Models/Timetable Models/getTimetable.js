import { connection } from "../../../database connections/databaseConnect.js";
import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors.js";

// get class timetable
export async function getClassTimetable({
  classId,
  semester,
  includeInactive = false,
  lectureType,
  dayOfWeek
}) {
  // 1. Validate required inputs
  if (!classId || isNaN(classId)) {
    throw DomainError.invalid("INVALID CLASS ID");
  }

  if (!semester || isNaN(semester)) {
    throw DomainError.invalid("INVALID SEMESTER");
  }

  // 2. Validate optional inputs
  if (
    lectureType &&
    !["theory", "practical"].includes(lectureType)
  ) {
    throw DomainError.invalid("INVALID LECTURE TYPE");
  }

  const validDays = [
    "Monday","Tuesday","Wednesday",
    "Thursday","Friday","Saturday","Sunday"
  ];

  if (dayOfWeek && !validDays.includes(dayOfWeek)) {
    throw DomainError.invalid("INVALID DAY OF WEEK");
  }

  // 3. Ensure class exists
  const [[classRow]] = await connection.query(
    `SELECT id FROM classes WHERE id = ?`,
    [classId]
  );

  if (!classRow) {
    throw DomainError.notFound("CLASS NOT FOUND");
  }

  // 4. Build query dynamically (safe + explicit)
  let sql = `
    SELECT
      ts.id,
      ts.day_of_week,
      ts.start_time,
      ts.end_time,
      ts.lecture_type,
      ts.lecturer_name AS lecturer,
      ts.is_active,
      sub.id AS subject_id,
      sub.name AS subject_name,
      sub.code AS subject_code
    FROM timetable_slots ts
    JOIN subjects sub
      ON sub.id = ts.subject_id
    WHERE ts.class_id = ?
      AND ts.semester = ?
  `;

  const params = [classId, semester];

  if (!includeInactive) {
    sql += ` AND ts.is_active = 1`;
  }

  if (lectureType) {
    sql += ` AND ts.lecture_type = ?`;
    params.push(lectureType);
  }

  if (dayOfWeek) {
    sql += ` AND ts.day_of_week = ?`;v 
    params.push(dayOfWeek);
  }

  sql += `
    ORDER BY
      FIELD(
        ts.day_of_week,
        'Monday','Tuesday','Wednesday',
        'Thursday','Friday','Saturday','Sunday'
      ),
      ts.start_time
  `;

  // 5. Execute
  const [rows] = await connection.query(sql, params);

  if (!rows.length) {
    throw DomainError.notFound("TIMETABLE NOT FOUND");
  }

  return rows;
}


