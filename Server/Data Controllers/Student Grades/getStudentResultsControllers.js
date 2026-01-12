import { getSemesterResultByRollNumber, getAllSemesterResultsByRollNumber, getLatestRecordedSemesterByRollNumber,getListOfAllRecoredeSemestersByRollNumber } from "../../Data Models/Student Grades/getStudentResultsService.js";
import { DomainError } from "../../Domain Errors/Grades Module Errors/domainErrors.js";

// get results semester wise for a student
async function getSemesterResultController(req, res, next) {
  try {
    const { student_id, semester } = req.query;

    if (!student_id || !semester) {
      return res
        .status(400)
        .json({ message: "student_id and semester are required" });
    }

    const results = await getSemesterResultByRollNumber(
      Number(student_id),
      Number(semester)
    );

    return res.status(200).json(results);
  } catch (err) {
    if(err instanceof DomainError){
      if(err.status==404){
        res.status(200).json({results:{}})
        return
      }
    }
    next(err); // let centralized error handler decide
  }
}

// get all semester results for a student
async function getStudentAllSemesterResults(req, res, next) {
  try {
    const { student_id } = req.query;

    const result = await getAllSemesterResultsByRollNumber(parseInt(student_id));

    res.status(200).json({data: result, status: true});
  } catch (err) {
    next(err); // delegated to global error middleware
  }
}

// get latests recorded semester given a student roll_number
async function getLatestSemester(req, res, next) {
  try {
    const { roll_number } = req.query;

    const latestSemester =
      await getLatestRecordedSemesterByRollNumber(roll_number);

    res.status(200).json({
      latest_semester: latestSemester,
      status: true
    });
  } catch (err) {
    next(err);
  }
}
// get list of all recorded semesters for a student
async function getListOfAllRecordedSemesters(req, res, next){
  try {
    const { roll_number } = req.query;
    const semestersList = await getListOfAllRecoredeSemestersByRollNumber(roll_number);
    res.status(200).json({data:semestersList, status:true});
  } catch (err) {
    next(err);
  }
}



export {getSemesterResultController,getStudentAllSemesterResults, getLatestSemester, getListOfAllRecordedSemesters};