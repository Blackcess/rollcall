import { connection } from "../../../../../database connections/databaseConnect.js";
import { DomainError } from "../../../../../Domain Errors/Grades Module Errors/domainErrors.js";
class TimetableSlotRepository {
  static async findById(slotId) {
    const [rows] = await connection.query(
      `
      SELECT *
      FROM timetable_slots
      WHERE id = ?
      `,
      [slotId]
    );

    return rows[0] || null;
  }

  static async findActiveSlotsForDay(classId, semester, dayOfWeek) {
    const [rows] = await connection.query(
      `
      SELECT *
      FROM timetable_slots
      WHERE class_id = ?
        AND semester = ?
        AND day_of_week = ?
        AND is_active = 1
      `,
      [classId, semester, dayOfWeek]
    );

    return rows;
  }

  static async findAllForClassSemester(classId, semester) {
    const [rows] = await connection.query(
      `
      SELECT *
      FROM timetable_slots
      WHERE class_id = ?
        AND semester = ?
      ORDER BY
        FIELD(day_of_week,
          'Monday','Tuesday','Wednesday',
          'Thursday','Friday'
        ),
        start_time
      `,
      [classId, semester]
    );

    return rows;
  }

  static async save(slot) {
    if (slot.id) {
      console.log("Im running",slot)
      await connection.query(
        `
        UPDATE timetable_slots
        SET
          day_of_week = ?,
          start_time = ?,
          end_time = ?,
          subject_id = ?,
          lecture_type = ?,
          lecturer_name = ?,
          is_active = ?
        WHERE id = ?
        `,
        [
          slot.day_of_week,
          slot.start_time,
          slot.end_time,
          slot.subject_id,
          slot.lecture_type,
          slot.lecturer_name,
          slot.is_active,
          slot.id,
        ]
      );

      return TimetableSlotRepository.findById(slot.id);
    }

    const [result] = await connection.query(
      `
      INSERT INTO timetable_slots (
        class_id,
        semester,
        day_of_week,
        start_time,
        end_time,
        subject_id,
        lecture_type,
        lecturer_name,
        is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
      `,
      [
        slot.class_id,
        slot.semester,
        slot.day_of_week,
        slot.start_time,
        slot.end_time,
        slot.subject_id,
        slot.lecture_type,
        slot.lecturer_name,
      ]
    );

    return TimetableSlotRepository.findById(result.insertId);
  }

  static async softDelete(slotId) {
    await connection.query(
      `
      UPDATE timetable_slots
      SET is_active = 0
      WHERE id = ?
      `,
      [slotId]
    );
  }
}

export default TimetableSlotRepository;
