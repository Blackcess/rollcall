import { connection } from "../../database connections/databaseConnect.js";
import { DomainError } from "../../Domain Errors/Grades Module Errors/domainErrors.js";


async function getPassedStudentsBySubject(subjectId) {
  if (!subjectId) {
    throw DomainError.invalid("SUBJECT ID IS REQUIRED");
  }

  const [rows] = await connection.query(
    `
    SELECT
      s.id AS student_id,
      s.roll_number,
      sg.grade_symbol
    FROM student_grades sg
    JOIN all_students s ON s.id = sg.student_id
    WHERE sg.subject_id = ?
      AND sg.status = "pass"
    `,
    [subjectId]
  );

  return rows;
}

async function getFailedStudentsBySubject(subjectId) {
  if (!subjectId) {
    throw DomainError.invalid("SUBJECT ID IS REQUIRED");
  }

  const [rows] = await connection.query(
    `
    SELECT
      s.id AS student_id,
      s.roll_number,
      sg.grade_symbol
    FROM student_grades sg
    JOIN all_students s ON s.id = sg.student_id
    WHERE sg.subject_id = ?
      AND sg.status = "re-appear"
    `,
    [subjectId]
  );
  return rows;
}

/**
 * Aggregate result statistics for a subject
 */
async function getSubjectResultAggregation(subjectId) {
  if (!subjectId) {
    throw DomainError.invalid("SUBJECT_ID_REQUIRED");
  }

  const [rows] = await connection.query(
    `
    SELECT
      grade_symbol,
      status,
      COUNT(*) AS count
    FROM student_grades
    WHERE subject_id = ?
    GROUP BY grade_symbol, status
    `,
    [subjectId]
  );

  if (!rows.length) {
    throw DomainError.notFound("NO_RESULTS_FOR_SUBJECT");
  }

  return projectSubjectAggregation(subjectId, rows);
}

/**
 * Reduce rows into aggregation metrics
 */
function projectSubjectAggregation(subjectId, rows) {
  let total = 0;
  let passed = 0;
  let failed = 0;

  const gradeDistribution = {};

  for (const row of rows) {
    total += row.count;

    if (row.status === "pass") passed += row.count;
    if (row.status !== "pass") failed += row.count;

    gradeDistribution[row.grade_symbol] =
      (gradeDistribution[row.grade_symbol] || 0) + row.count;
  }

  return {
    subjectId,
    total_students: total,
    passed,
    failed,
    pass_percentage: Number(((passed / total) * 100).toFixed(2)),
    grade_distribution: gradeDistribution
  };
}

export {getFailedStudentsBySubject,getPassedStudentsBySubject, getSubjectResultAggregation}