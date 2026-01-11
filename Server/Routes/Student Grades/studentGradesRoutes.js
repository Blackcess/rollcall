import { Router } from "express";
import { getSemesterResultController,getStudentAllSemesterResults, getLatestSemester,getListOfAllRecordedSemesters} from "../../Data Controllers/Student Grades/getStudentResultsControllers.js";
import { getPassed, getFailed,getSubjectAggregationController } from "../../Data Controllers/Student Grades/subjectResultsController.js";

const studentGradeRouter = Router();

studentGradeRouter.get("/semester",getSemesterResultController); 
studentGradeRouter.get("/all-semesters",getStudentAllSemesterResults);
studentGradeRouter.get("/latest-semester",getLatestSemester);
studentGradeRouter.get("/list-all-recorded-semesters",getListOfAllRecordedSemesters);
studentGradeRouter.get("/subjectResults/passed",getPassed);
studentGradeRouter.get("/subjectResults/failed",getFailed);
studentGradeRouter.get("/subjectResults/aggregation",getSubjectAggregationController);

export { studentGradeRouter };