import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors.js";
import { StudentSubjectEnrollmentService } from "../../../Data Models/ADMIN panel Models/Class Service/studentSubjectEnrollmentService.js";

export class StudentSubjectEnrollmentController {

  static async enrollManual(req, res) {
    try {
      const {
        studentId,
        classId,
        semesterEnrollmentId,
        subjectId,
        enrollmentType
      } = req.body;

      await StudentSubjectEnrollmentService.enrollStudentInSubject({
        studentId: parseInt(studentId),
        classId: parseInt(classId),
        semesterEnrollmentId: parseInt(semesterEnrollmentId),
        subjectId: parseInt(subjectId),
        enrollmentType
      });

      res.status(201).json({ status: true });

    } catch (err) {
      this.#handleError(err, res);
    }
  }
  static async enrollAutomatic(req,res){
    try {   
        const {
            studentId,
            classId,
            semesterEnrollmentId
        } = req.body;
        await StudentSubjectEnrollmentService.enrollMandatorySubjectsForSemester({ 
            studentId:parseInt(studentId),
            classId:parseInt(classId), 
            semesterEnrollmentId
        })
        res.status(201).json({status:true})

    } catch (err) {
        StudentSubjectEnrollmentController.#handleError(err,res)
    }
  }

  static async listSubjects(req, res) {
    try {
      const { semesterEnrollmentId } = req.params;

      const subjects =
        await StudentSubjectEnrollmentService
          .getSubjectsForSemester(semesterEnrollmentId);

      res.json({ status: true, data: subjects });

    } catch (err) {
      this.#handleError(err, res);
    }
  }

  static #handleError(err, res) {
    if (err instanceof DomainError) {
      return res.status(err.status).json({
        status: false,
        error: {
          code: err.code,
          message: err.message
        }
      });
    }

    console.error(err);
    return res.status(500).json({
      status: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "UNEXPECTED SERVER ERROR"
      }
    });
  }
}
