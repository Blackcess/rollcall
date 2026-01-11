// enforce subject must belong to the class and semester
import { connection } from "../../../../../database connections/databaseConnect.js";

class SubjectRepository {
  static async existsForClassSemester(subjectId, classId, semester) {
    console.log("Values are ",semester,classId,subjectId)
    const [rows] = await connection.query(
      `
      SELECT 1
      FROM subjects
      WHERE id = ?
        AND class_id = ?
        AND semester = ?
      LIMIT 1
      `,
      [subjectId, classId, semester]
    );

    return rows.length > 0;
  }
}

export default SubjectRepository;
