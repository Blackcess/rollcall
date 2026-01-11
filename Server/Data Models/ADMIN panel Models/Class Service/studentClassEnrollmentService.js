import { connection } from "../../../database connections/databaseConnect.js";
import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors.js";


class StudentClassEnrollmentService {

  static async enrollStudent({ student_id, class_id, enrolled_by }) {
    if (!student_id || !class_id) {
      throw DomainError.invalid("STUDENT ID AND CLASS ID ARE REQUIRED");
    }

    // 1. Ensure student exists
    const [[student]] = await connection.query(
      `SELECT id FROM all_students WHERE id = ?`,
      [student_id]
    );
    if (!student) {
      throw DomainError.notFound("STUDENT NOT FOUND");
    }

    // 2. Ensure class exists and is active
    const [[cls]] = await connection.query(
      `SELECT id, status FROM classes WHERE id = ?`,
      [class_id]
    );
    if (!cls) {
      throw DomainError.notFound("CLASS NOT FOUND");
    }
    if (cls.status !== "ACTIVE") {
      throw DomainError.invalid("CANNOT ENROLL INTO INACTIVE CLASS");
    }

    // 3. Ensure student is not already enrolled
    const [[existing]] = await connection.query(
      `
      SELECT id FROM student_class_enrollments
      WHERE student_id = ? AND status = 'ACTIVE'
      `,
      [student_id]
    );
    if (existing) {
      throw DomainError.invalid("STUDENT ALREADY ENROLLED IN A CLASS");
    }

    // 4. Create enrollment
    const [result] = await connection.query(
      `
      INSERT INTO student_class_enrollments
      (student_id, class_id, enrolled_by)
      VALUES (?, ?, ?)
      `,
      [student_id, class_id, enrolled_by]
    );

    return {
      enrollment_id: result.insertId,
      student_id,
      class_id
    };
  }

  static async unenrollStudent({ student_id, class_id,status}) {
    // if (!student_id || !class_id || status) {
    //   throw DomainError.invalid("STUDENT ID AND CLASS ID ARE REQUIRED");
    // }
    const [result] = await connection.query(
      `
      UPDATE student_class_enrollments
      SET status = ?
      WHERE student_id = ?
        AND class_id = ?
        AND status = 'ACTIVE'
      `,
      [status,student_id, class_id]
    );

    if (result.affectedRows === 0) {
      throw DomainError.notFound("ACTIVE ENROLLMENT NOT FOUND");
    }

    return true;
  }

  static async getStudentClass(student_id) {
    const [[row]] = await connection.query(
      `
      SELECT c.*
      FROM student_class_enrollments e
      JOIN classes c ON c.id = e.class_id
      WHERE e.student_id = ?
        AND e.status = 'ACTIVE'
      `,
      [student_id]
    );

    if (!row) {
      throw DomainError.notFound("STUDENT NOT ENROLLED IN ANY CLASS");
    }

    return row;
  }

  static async listClassStudents(class_id) {
    if(!class_id){
         throw DomainError.invalid("CLASS ID RECQUIRED");
    }
    const [rows] = await connection.query(
      `
      SELECT s.*
      FROM student_class_enrollments e
      JOIN all_students s ON s.id = e.student_id
      WHERE e.class_id = ?
        AND e.status = 'ACTIVE'
      `,
      [parseInt(class_id)]
    );
    return rows;
  }
}

export default StudentClassEnrollmentService;
