import { getFailedStudentsBySubject, getPassedStudentsBySubject,getSubjectResultAggregation} from "../../Data Models/Student Grades/subjectResult.js";

async function getPassed(req, res, next) {
  try {
    const { subjectId } = req.query;

    const students = await getPassedStudentsBySubject(subjectId);

    res.status(200).json({ students });
  } catch (err) {
    next(err);
  }
}

async function getFailed(req, res, next) {
  try {
    const { subjectId } = req.query;

    const students = await getFailedStudentsBySubject(subjectId);

    res.status(200).json({ students });
  } catch (err) {
    next(err);
  }
}

// get subject aggregates
async function getSubjectAggregationController(req, res, next) {
  try {
    const { subjectId } = req.query;
    // console.log("Subject Id for aggregation ",subjectId)

    const aggregation = await getSubjectResultAggregation(parseInt(subjectId));

    res.status(200).json({
      status: true,
      data: aggregation
    });
  } catch (err) {
    next(err);
  }
}

export {getPassed,getFailed, getSubjectAggregationController}