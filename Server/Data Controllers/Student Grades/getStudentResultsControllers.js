import { getSemesterResultByRollNumber, getAllSemesterResultsByRollNumber, getLatestRecordedSemesterByRollNumber,getListOfAllRecoredeSemestersByRollNumber } from "../../Data Models/Student Grades/getStudentResultsService.js";

// get results semester wise for a student
async function getSemesterResultController(req, res, next) {
  try {
    const { roll_number, semester } = req.query;

    if (!roll_number || !semester) {
      return res
        .status(400)
        .json({ message: "roll_number and semester are required" });
    }

    const results = await getSemesterResultByRollNumber(
      Number(roll_number),
      Number(semester)
    );

    return res.status(200).json(results);
  } catch (err) {
    next(err); // let centralized error handler decide
  }
}

// get all semester results for a student
async function getStudentAllSemesterResults(req, res, next) {
  try {
    const { roll_number } = req.query;

    const result = await getAllSemesterResultsByRollNumber(parseInt(roll_number));

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