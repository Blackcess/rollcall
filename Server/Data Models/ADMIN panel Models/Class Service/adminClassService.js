import { connection } from "../../../database connections/databaseConnect.js";
import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors.js";


class ClassService {

  // get all classes
  static async getAllClasses(){
    const [classes] = await connection.query(`
      SELECT 
      id,
      name,
      total_semesters,
      current_semester 
      FROM classes
    `)
    return classes
  }
  // get class details
  static async getClassDetails(id){
    if(!id){
      throw DomainError.invalid("INVALID_ID")
    }
    const [details] = await connection.query(`
      SELECT 
      name,
      total_semesters,
      current_semester 
      FROM classes
      WHERE id = ? 
    `,[parseInt(id)])
    return details
  }
  /**
   * Create a new academic class
   */
  static async createClass(input) {
    const {
      name,
      academic_term,
      start_year,
      end_year,
      program_code,
      owner_id,
      total_semesters
    } = input;

    // --- Validation ---
    if (!name || !academic_term || !start_year || !end_year || !owner_id) {
      throw DomainError.invalid("MISSING REQUIRED CLASS FIELDS");
    }

    if (start_year >= end_year) {
      throw DomainError.invalid("INVALID ACADEMIC YEAR RANGE");
    }

    // --- Owner existence ---
    const [ownerRows] = await connection.query(
      "SELECT id FROM activated_accounts WHERE id = ?",
      [owner_id]
    );

    if (!ownerRows.length) {
      throw DomainError.notFound("CLASS OWNER NOT FOUND");
    }

    // --- Name uniqueness ---
    const [existing] = await connection.query(
      "SELECT id FROM classes WHERE name = ?",
      [name]
    );

    if (existing.length) {
      throw DomainError.invalid("CLASS NAME ALREADY EXISTS");
    }

    // --- Insert ---
    const [result] = await connection.query(
      `
      INSERT INTO classes
        (name, academic_term, start_year, end_year, status, owner_id,program_code,total_semesters)
      VALUES
        (?, ?, ?, ?, 'ACTIVE', ?,?,?)
      `,
      [name, academic_term, start_year, end_year, owner_id,program_code,total_semesters]
    );

    return {
      class_id: result.insertId
    };
  }

  /**
   * Update mutable class fields
   */
  static async updateClass(classId, patch) {
    if (!classId) {
      throw DomainError.invalid("CLASS ID REQUIRED");
    }

    const [rows] = await connection.query(
      "SELECT status FROM classes WHERE id = ?",
      [classId]
    );

    if (!rows.length) {
      throw DomainError.notFound("CLASS NOT FOUND");
    }

    if (rows[0].status === "ARCHIVED") {
      throw DomainError.invalid("ARCHIVED CLASS CANNOT BE MODIFIED");
    }

    const allowedFields = ["name", "academic_term", "status"];
    const updates = [];
    const values = [];

    for (const key of allowedFields) {
      if (patch[key]) {
        updates.push(`${key} = ?`);
        values.push(patch[key]);
      }
    }

    if (!updates.length) {
      throw DomainError.invalid("NO VALID FIELDS TO UPDATE");
    }

    // name uniqueness (if updating name)
    if (patch.name) {
      const [dup] = await connection.query(
        "SELECT id FROM classes WHERE name = ? AND id != ?",
        [patch.name, classId]
      );
      if (dup.length) {
        throw DomainError.invalid("CLASS NAME ALREADY EXISTS");
      }
    }

    await connection.query(
      `UPDATE classes SET ${updates.join(", ")} WHERE id = ?`,
      [...values, classId]
    );
  }

  /**
   * Archive a class
   */
  static async archiveClass(classId) {
    if (!classId) {
      throw DomainError.invalid("CLASS ID REQUIRED");
    }

    const [rows] = await connection.query(
      "SELECT status FROM classes WHERE id = ?",
      [classId]
    );

    if (!rows.length) {
      throw DomainError.notFound("CLASS NOT FOUND");
    }

    if (rows[0].status === "ARCHIVED") {
      return; // idempotent
    }

    // Block archival if active semesters exist
    const [activeSemesters] = await connection.query(
      `
      SELECT id FROM student_semester_enrollments
      WHERE class_id = ? AND status = 'ACTIVE'
      `,
      [classId]
    );

    if (activeSemesters.length) {
      throw DomainError.invalid(
        "CANNOT ARCHIVE CLASS WITH ACTIVE SEMESTERS"
      );
    }

    await connection.query(
      "UPDATE classes SET status = 'ARCHIVED' WHERE id = ?",
      [classId]
    );
  }
}

export default ClassService;