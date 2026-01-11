import { connection } from "../../../database connections/databaseConnect.js";
import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors.js";

class AdminSemesterService {

  static async getEnrollmentContext() {
    const [rows] = await connection.query(`
      SELECT MAX(semester_number) AS max_sem
      FROM student_semester_enrollments
    `);

    const targetSemester = (rows[0].max_sem || 0) + 1;

    if (targetSemester < 1) {
      throw DomainError.invalid("INVALID_SEMESTER_SEQUENCE");
    }

    return { targetSemester };
  }

  static async getEligibleStudents() {
    const { targetSemester } = await this.getEnrollmentContext();

    const [rows] = await connection.query(`
      SELECT 
        s.id AS studentId,
        s.roll_number,
        s.student_name,
        c.name AS className,
        c.id AS class_id,
        MAX(se.semester_number) AS lastCompletedSemester,
        EXISTS (
        SELECT 1
        FROM student_semester_enrollments ase
        WHERE ase.student_id = s.id
        AND ase.class_id = sce.class_id
        AND ase.status = 'ACTIVE'
        ) AS hasActiveSemester
      FROM all_students s
      JOIN student_class_enrollments sce ON sce.student_id = s.id AND sce.status = 'ACTIVE'
      JOIN classes c ON c.id = sce.class_id
      LEFT JOIN student_semester_enrollments se 
      ON se.student_id = s.id
      AND se.class_id = sce.class_id
      AND se.status = 'COMPLETED'

      GROUP BY s.id;
    `);
    let eligibilityReason =""
    const eligibilityTest= (r)=>{
        if(r.hasActiveSemester!==0){
            console.log("reson for failure","has active semester")
            eligibilityReason="HAS_ACTIVE_SEMESTER"
            return false
        }
        if((r.lastCompletedSemester || 0) !== (targetSemester-1)){
            console.log("reson for failure","student missed semester")
            eligibilityReason=`STUDENT_MISSED_SEMESTER_${r.lastCompletedSemester+1}`
            return false
        }
        eligibilityReason=""
        return true
      }
    console.log("Has active semester",targetSemester)
    return rows.map(r => ({
      studentId: r.studentId,
      rollNumber: r.roll_number,
      classId:r.class_id,
      name: r.student_name,
      className: r.className,
      lastCompletedSemester: r.lastCompletedSemester || 0,
      eligible:eligibilityTest(r),
      eligibilityReason
        
    }));
  }
//   (!r.hasActiveSemester &&
//         (r.lastCompletedSemester || 0) == targetSemester - 1)

//   static async enrollStudent({ studentId }) {
//     const conn = await connection.getConnection();
//     await conn.beginTransaction();

//     try {
//       // Validate student
//       const [[student]] = await conn.query(
//         "SELECT id FROM all_students WHERE id = ?",
//         [studentId]
//       );
//       if (!student) {
//         throw DomainError.notFound("STUDENT_NOT_FOUND");
//       }

//       // Ensure no active semester
//       const [[active]] = await conn.query(
//         `SELECT id FROM student_semester_enrollments
//          WHERE student_id = ? AND status = 'ACTIVE'`,
//         [studentId]
//       );
//       if (active) {
//         throw DomainError.invalid("ACTIVE_SEMESTER_EXISTS");
//       }

//       // Determine target semester
//       const [[last]] = await conn.query(
//         `SELECT MAX(semester_number) AS last_sem
//          FROM student_semester_enrollments
//          WHERE student_id = ?`,
//         [studentId]
//       );

//       const targetSemester = (last.last_sem || 0) + 1;

//       // Create semester enrollment
//       const [res] = await conn.query(
//         `INSERT INTO student_semester_enrollments
//          (student_id, semester_number, status)
//          VALUES (?, ?, 'ACTIVE')`,
//         [studentId, targetSemester]
//       );

//       const semesterEnrollmentId = res.insertId;

//       // Automatic core subject enrollment
//       await conn.query(`
//         INSERT INTO student_subject_enrollments
//         (student_id, subject_id, semester_enrollment_id)
//         SELECT ?, cs.subject_id, ?
//         FROM class_subjects cs
//         WHERE cs.is_core = 1
//       `, [studentId, semesterEnrollmentId]);

//       await conn.commit();

//       return {
//         studentId,
//         semester: targetSemester
//       };

//     } catch (err) {
//       await conn.rollback();
//       throw err;
//     } finally {
//       conn.release();
//     }
//   }
}

export { AdminSemesterService };
