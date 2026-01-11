import { connection } from "../../../database connections/databaseConnect.js";
import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors.js";
import { StudentSubjectEnrollmentService } from "./studentSubjectEnrollmentService.js";

class StudentSemesterEnrollmentService {
  constructor(db = connection) {
    this.db = db;
  }

//   private helpers
  async _assertStudentIsInClass(studentId, classId) {

    const [rows] = await this.db.query(
      `SELECT id
       FROM student_class_enrollments
       WHERE student_id = ?
         AND class_id = ?
         AND status = 'ACTIVE'`,
      [studentId, classId]
    );

    if (!rows.length) {
      throw DomainError.invalid(
        "STUDENT IS NOT ENROLLED IN THE CLASS"
      );
    }

    return rows[0];
  }

  async _getLatestSemester(studentId, classId) {
    const [rows] = await this.db.query(
      `SELECT id, semester_number, status
       FROM student_semester_enrollments
       WHERE student_id = ?
         AND class_id = ?
       ORDER BY semester_number DESC
       LIMIT 1`,
      [studentId, classId]
    );

    return rows.length ? rows[0] : null;
  }

  async _assertNoActiveSemester(studentId, classId) {
    const [rows] = await this.db.query(
      `SELECT id
       FROM student_semester_enrollments
       WHERE student_id = ?
         AND class_id = ?
         AND status = 'ACTIVE'`,
      [studentId, classId]
    );

    if (rows.length) {
      throw DomainError.invalid(
        "STUDENT ALREADY HAS AN ACTIVE SEMESTER"
      );
    }
  }

//   publeic service methods (CORE METHODS)
// enroll a student to a semester
async enrollStudent({
        studentId,
        classId,
        semesterNumber,
        enrolledBy
        }) 
    {
      const conn = await connection.getConnection();
      // console.log("The connection is ", conn)
      try {
        await conn.beginTransaction();

        if (!studentId || !classId || !semesterNumber || !enrolledBy) {
            throw DomainError.invalid("MISSING REQUIRED PARAMETERS");
        }

        /* 1. Class enrollment guard */
        await this._assertStudentIsInClass(studentId, classId);

        /* 2. Active semester guard */
        await this._assertNoActiveSemester(studentId, classId);


        /* 3. Progression validation */
        const lastSemester = await this._getLatestSemester(studentId, classId);

        if (!lastSemester) {
            if (semesterNumber !== 1) {
                throw DomainError.invalid(
                    "FIRST SEMESTER MUST BE SEMESTER 1"
                );
            }
        } else {
            if (lastSemester.status === "ACTIVE") {
                throw DomainError.invalid(
                    "PREVIOUS SEMESTER IS STILL ACTIVE"
                );
            }

            const expected = lastSemester.semester_number + 1;
            if (semesterNumber !== expected) {
                throw DomainError.invalid(
                    `INVALID SEMESTER SEQUENCE. EXPECTED SEMESTER ${expected}`
                );
            }
        }

        /* 4. Hard duplicate safety */
        const [duplicate] = await conn.query(
            `SELECT id
            FROM student_semester_enrollments
            WHERE student_id = ?
            AND class_id = ?
            AND semester_number = ?`,
            [studentId, classId, semesterNumber]
        );

        if (duplicate.length) {
            throw DomainError.invalid(
                "STUDENT IS ALREADY ENROLLED IN THIS SEMESTER"
            );
        }

        /* 5. Persist */
        const [result] = await conn.query(
            `INSERT INTO student_semester_enrollments
            (student_id, class_id, semester_number, status, enrolled_by)
            VALUES (?, ?, ?, 'ACTIVE', ?)`,
            [studentId, classId, semesterNumber, enrolledBy]
        );
        // console.log("The resulty is ",result)
        const semesterEnrollmentId = result.insertId
         // 4. Automatic subject enrollment (MANDATORY)
        await StudentSubjectEnrollmentService.enrollMandatorySubjectsForSemester({
          studentId,
          classId,
          semesterEnrollmentId,
          semester:semesterNumber,
          connect: conn  // important
          
        });

      await conn.commit();
        console.log("Im Done...")
        return {
            id: result.insertId,
            student_id: studentId,
            class_id: classId,
            semester_number: semesterNumber,
            status: "ACTIVE"
        };
      } catch (err) {
        await conn.rollback()
        throw err;
      }
      finally{
        await conn.release()
      }
       
    }

    // complete a semester
async completeSemester({ semesterEnrollmentId }) {
    if (!semesterEnrollmentId) {
      throw DomainError.invalid("SEMESTER ENROLLMENT ID IS REQUIRED");
    }

    const [rows] = await this.db.query(
      `SELECT status
       FROM student_semester_enrollments
       WHERE id = ?`,
      [semesterEnrollmentId]
    );

    if (!rows.length) {
      throw DomainError.notFound(
        "SEMESTER ENROLLMENT NOT FOUND"
      );
    }

    if (rows[0].status !== "ACTIVE") {
      throw DomainError.invalid(
        "ONLY ACTIVE SEMESTERS CAN BE COMPLETED"
      );
    }

    await this.db.query(
      `UPDATE student_semester_enrollments
       SET status = 'COMPLETED'
       WHERE id = ?`,
      [semesterEnrollmentId]
    );

    return { success: true };
}

// Get the active semester for a class
async getActiveSemesterForStudent({ studentId, classId }) {
    const [rows] = await this.db.query(
      `SELECT *
       FROM student_semester_enrollments
       WHERE student_id = ?
         AND class_id = ?
         AND status = 'ACTIVE'`,
      [studentId, classId]
    );

    if (!rows.length) {
      throw DomainError.notFound(
        "NO ACTIVE SEMESTER FOUND"
      );
    }

    return rows[0];
}

// Get list of semester history per student
async listSemesterHistory({ studentId, classId }) {
    const [rows] = await this.db.query(
      `SELECT *
       FROM student_semester_enrollments
       WHERE student_id = ?
         AND class_id = ?
       ORDER BY semester_number ASC`,
      [studentId, classId]
    );

    return rows;
}
}



export const studentSemesterEnrollmentService =
  new StudentSemesterEnrollmentService();






