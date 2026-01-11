import StudentClassEnrollmentService from "../../../Data Models/ADMIN panel Models/Class Service/studentClassEnrollmentService.js";
import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors.js";

class AdminEnrollmentController {

  static async enrollStudent(req, res) {
    try {
      const adminId = req.user.id;

      const result = await StudentClassEnrollmentService.enrollStudent({
        ...req.body,
        enrolled_by: adminId
      });

      res.status(201).json({ status: true, data: result });

    } catch (err) {
      AdminEnrollmentController.#handle(err, res);
    }
  }

  static async unenrollStudent(req, res) {
    try {
      await StudentClassEnrollmentService.unenrollStudent(req.body);
      res.status(200).json({ status: true });
    } catch (err) {
      AdminEnrollmentController.#handle(err, res);
    }
  }
  static async getClassList(req,res){
    const {class_id}= req.query
    try {
        const rows =await StudentClassEnrollmentService.listClassStudents(class_id)
        res.status(200).json({status:true, data:rows})
    } catch (err) {
        AdminEnrollmentController.#handle(err, res);
    }
  }

  static #handle(err, res) {
    if (err instanceof DomainError) {
      return res.status(err.status).json({
        status: false,
        error: err.message
      });
    }
    console.error(err);
    res.status(500).json({ status: false });
  }
}

export default AdminEnrollmentController;
