import e from "express"
const syllabusRouter = e.Router();
import { getSyllabusBySubjectName } from "../../Data Controllers/Subject Module Controllers/subjectSyllabusController.js";

syllabusRouter.get('/subject-wise', getSyllabusBySubjectName);

export {syllabusRouter}
