import { getSubjectsBySemester,getSubjectById } from "../../Data Models/Subject Module Models/getSubjects.js";

// list subjects in a given semester
async function listSubjects(req, res, next) {
  try {
    const { semester } = req.query;

    const subjects = await getSubjectsBySemester(semester);

    res.status(200).json({
      data:subjects,
      status:true
    });
  } catch (err) {
    next(err);
  }
}
// get subject by Id
async function getSubject(req, res, next) {
  try {
    const { subjectId } = req.query;

    const subject = await getSubjectById(subjectId);

    res.status(200).json({
      subject
    });
  } catch (err) {
    next(err);
  }
}

export { listSubjects, getSubject };