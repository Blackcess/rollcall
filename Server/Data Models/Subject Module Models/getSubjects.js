import { connection } from "../../database connections/databaseConnect.js";
import { DomainError } from "../../Domain Errors/Grades Module Errors/domainErrors.js";

 function normalizeImagePath(localPath) {
        // Replace the absolute part with the URL base
        return localPath
            .replace(/\\/g, '/') // fix backslashes
            .replace(
            /^C:\/Users\/Thomas\/Documents\/full-stack-app-1\/Server/,
            process.env.BACKENDHOST
        );
}
// Get subjects in a specific semester
async function getSubjectsBySemester(semester) {
  if (!semester) {
    throw DomainError.invalid("SEMESTER IS REQUIRED");
  }

  const [rows] = await connection.query(
    `
    SELECT
      id,
      name AS subject_name,
      semester,
      subject_image
    FROM subjects
    WHERE semester = ?
    ORDER BY name
    `,
    [semester]
  );

  return rows.map(subject => ({
    id: subject.id,
    name: subject.subject_name,
    semester: subject.semester,
    subject_image_url: buildSubjectImageUrl(subject.subject_image)
  }));
}

function buildSubjectImageUrl(imagePath) {
  if (!imagePath) return null;
    return normalizeImagePath(imagePath);
}

// get specific subject by Id
async function getSubjectById(subjectId) {
  if (!subjectId) {
    throw DomainError.invalid("SUBJECT ID IS REQUIRED");
  }

  const [rows] = await connection.query(
    `
    SELECT
      id,
      name AS subject_name,
      semester,
      subject_image
    FROM subjects
    WHERE id = ?
    LIMIT 1
    `,
    [subjectId]
  );

  if (rows.length === 0) {
    throw DomainError.notFound("SUBJECT NOT FOUND");
  }

  const subject = rows[0];

  return {
    id: subject.id,
    subject_name: subject.subject_name,
    semester: subject.semester,
    subject_image: buildSubjectImageUrl(subject.subject_image)
  };
}



export { getSubjectsBySemester,getSubjectById };