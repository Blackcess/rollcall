import { connection } from "../../../database connections/databaseConnect.js";
import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors.js";

export class StudentSubjectEnrollmentService {

  static async enrollMandatorySubjectsForSemester({
    studentId,
    classId,
    semesterEnrollmentId,
    semester,
    connect
  }) {
    if(!studentId || !classId || !semesterEnrollmentId){
      throw DomainError.invalid("INVALID INPUT FOUND")
    }
    // fetch mandatory subjects for class + semester
    const [subjects] = await connect.query(
      `
      SELECT id, is_mandatory AS subject_type
      FROM subjects
      WHERE class_id = ?
        AND semester = ?
      `,
      [classId,semester]
    );

    if (!subjects.length) {
      throw DomainError.notFound("NO MANDATORY SUBJECTS FOUND");
    }

    for (const subject of subjects) {
      await this.#safeEnroll({
        studentId,
        classId,
        semesterEnrollmentId,
        subjectId: subject.id,
        enrollmentType: (subject.subject_type)? "CORE" : "ELECTIVE",
        connect,
        semester
      });
    }
  }

  static async enrollStudentInSubject({
    studentId,
    classId,
    semesterEnrollmentId,
    subjectId,          
    enrollmentType = "ELECTIVE"
  }) {
    return this.#safeEnroll({
      studentId,
      classId,
      semesterEnrollmentId,
      subjectId,
      enrollmentType,
      connect:connection
    });
  }

  static async #safeEnroll({
    studentId,
    classId,
    semesterEnrollmentId,
    subjectId,
    enrollmentType,
    connect:connection,
    semester
  }) {
    // uniqueness check
    const [exists] = await connection.query(
      `
      SELECT id FROM student_subject_enrollments
      WHERE student_id = ?
        AND subject_id = ?
        AND semester_enrollment_id = ?
      `,
      [studentId, subjectId, semesterEnrollmentId]
    );

    if (exists.length) {
      throw DomainError.invalid("SUBJECT ALREADY ENROLLED");
    }

    await connection.query(
      `
      INSERT INTO student_subject_enrollments
      (student_id, class_id, semester_enrollment_id, subject_id,subject_type,status,semester)
      VALUES (?, ?, ?, ?, ?,"ACTIVE",?)
      `,
      [
        studentId,
        classId,
        semesterEnrollmentId,
        subjectId,
        enrollmentType,
        semester
      ]
    );
  }

  static async getSubjectsForSemester(semesterEnrollmentId) {
    const [rows] = await connection.query(
      `
      SELECT s.*, sse.subject_type, sse.status
      FROM student_subject_enrollments sse
      JOIN subjects s ON s.id = sse.subject_id
      WHERE sse.semester_enrollment_id = ?
      `,
      [semesterEnrollmentId]
    );

    return rows;
  }
}
