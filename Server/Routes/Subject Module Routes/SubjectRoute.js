import { Router } from "express";
import { listSubjects, getSubject } from "../../Data Controllers/Subject Module Controllers/getSubjectController.js";

const SubjectRouter = Router();

SubjectRouter.get("/", listSubjects);
SubjectRouter.get("/subject-by-id", getSubject);
export { SubjectRouter }