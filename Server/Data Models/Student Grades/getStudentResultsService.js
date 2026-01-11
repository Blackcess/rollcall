import { connection } from "../../database connections/databaseConnect.js";
import { DomainError } from "../../Domain Errors/Grades Module Errors/domainErrors.js";


async function getSemesterResultByRollNumber(rollNumber, semester) {
  if (!rollNumber || !semester) {
    throw DomainError.invalid("ROLL NUMBER AND SEMESTER ARE REQUIRED");
  }


  // 1. Semester header
  const [headerRows] = await connection.query(
    `
    SELECT
      st.id AS student_id,
      st.roll_number,
      st.student_name,
      ssr.result_status,
      ssr.passed,
      ssr.credits,
      ssr.sgpa
    FROM all_students st
    JOIN student_semester_results ssr
      ON ssr.student_id = st.id
    WHERE st.roll_number = ?
      AND ssr.semester = ?;
    `,
    [rollNumber, semester]
  );

  if (!headerRows.length) {
    throw DomainError.notFound("NO RECORDS FOUND");
  }

  const header = headerRows[0];

  // 2. Subject grades
  const [gradeRows] = await connection.query(
    `
    SELECT
      sub.name AS subject_name,
      g.grade_symbol,
      g.qualitative_meaning,
      g.status
    FROM student_grades g
    JOIN subjects sub
      ON sub.id = g.subject_id
    WHERE g.student_id = ?
      AND g.semester = ?
    ORDER BY sub.id;
    `,
    [header.student_id, semester]
  );

  // 3. Legacy projection
  const result = {
    roll_number: header.roll_number,
    student_name: header.student_name,
    result_status: header.result_status,
    passed: header.passed,
    credits: header.credits,
    SGPA: header.sgpa
  };

  for (const row of gradeRows) {
    result[row.subject_name] =
      `${row.grade_symbol},${row.qualitative_meaning},${row.status}`;
  }

  // legacy API returns an array
  return [result];
}

// console.log("Lets see tHIRED SEMESTER: ", await getSemesterResultByRollNumber(2305399, 3));

/**
 * Fetch all semester results for a student (legacy-compatible shape)
 */
async function getAllSemesterResultsByRollNumber(rollNumber) {
  if (!rollNumber) {
    throw DomainError.invalid("ROLL NUMBER IS REQUIRED");
  }

  const [rows] = await connection.query(
    `
    SELECT
      st.roll_number,
      st.student_name,
      r.semester,
      r.result_status,
      r.passed,
      r.credits,
      r.sgpa,
      sub.name AS subject_name,
      g.grade_symbol,
      g.qualitative_meaning,
      g.status
    FROM all_students st
    JOIN student_grades g
      ON g.student_id = st.id
    JOIN subjects sub
      ON sub.id = g.subject_id
    JOIN student_semester_results r
      ON r.student_id = g.student_id
     AND r.semester = g.semester
    WHERE st.roll_number = ?
    ORDER BY r.semester, sub.id;
    `,
    [rollNumber]
  );

  if (!rows.length) {
    throw DomainError.notFound("NO RESULTS FOUND FOR STUDENT");
  }

  return projectAllSemesterResults(rows);
}

/**
 * Groups rows by semester and projects each semester
 * into legacy-compatible view shape
 */
function projectAllSemesterResults(rows) {
  const rollNumber = rows[0].roll_number;

  const groupedBySemester = {};

  for (const row of rows) {
    const semesterKey = `semester_${row.semester}`;

    if (!groupedBySemester[semesterKey]) {
      groupedBySemester[semesterKey] = {
        roll_number: row.roll_number,
        student_name: row.student_name,
        result_status: row.result_status,
        passed: row.passed,
        credits: row.credits,
        SGPA: row.sgpa
      };
    }

    groupedBySemester[semesterKey][row.subject_name] =
      `${row.grade_symbol},${row.qualitative_meaning},${row.status}`;
  }

  return {
    roll_number: rollNumber,
    all_semester_results: groupedBySemester
  };
}
// get latest recorded semester given a student roll_number
async function getLatestRecordedSemesterByRollNumber(rollNumber) {
  if (!rollNumber) {
    throw DomainError.invalid("ROLL NUMBER IS REQUIRED");
  }

  const [rows] = await connection.query(
    `
    SELECT MAX(g.semester) AS latest_semester
    FROM student_grades g
    JOIN all_students s
      ON s.id = g.student_id
    WHERE s.roll_number = ?
    `,
    [rollNumber]
  );

  if (!rows.length || rows[0].latest_semester === null) {
    throw DomainError.notFound("NO SEMESTER DATA FOUND FOR STUDENT");
  }

  return rows[0].latest_semester;
}

//get list of all student recorded semesters
async function getListOfAllRecoredeSemestersByRollNumber(roll_number){
  if(!roll_number){
    throw DomainError.invalid("ROLL NUMBER IS REQUIRED");
  }
  //get student id from roll_number
  const [rows] =await connection.query(`
    SELECT id FROM all_students WHERE roll_number = ?
  `,[roll_number]);
  if(!rows.length){
    throw DomainError.notFound("NO STUDENT FOUND WITH THE PROVIDED ROLL NUMBER");
  }
  const student_id = rows[0].id;

  //get list of all recorded semesters for the student
  const [semRows] = await connection.query(`
    SELECT DISTINCT semester FROM student_grades WHERE student_id = ? ORDER BY semester;
  `,[student_id]);

  return semRows.map(row => row.semester);
}


// console.log("Lets see all semesters for Thomas: ", await getListOfAllRecoredeSemestersByRollNumber(2305336));
export {getSemesterResultByRollNumber,getAllSemesterResultsByRollNumber,getLatestRecordedSemesterByRollNumber,getListOfAllRecoredeSemestersByRollNumber};