import { connection } from "../../../../../database connections/databaseConnect.js";

class ClassRepository {
  static async findById(classId) {
    const [rows] = await connection.query(
      `
      SELECT id, current_semester
      FROM classes
      WHERE id = ?
      `,
      [classId]
    );

    return rows[0] || null;
  }
}

export default ClassRepository;
