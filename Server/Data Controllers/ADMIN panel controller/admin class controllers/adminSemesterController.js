import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors.js";
import { AdminSemesterService } from "../../../Data Models/ADMIN panel Models/Class Service/adminSemesterService.js";


class AdminSemesterController {

  static async getContext(req, res) {
    try {
      const data = await AdminSemesterService.getEnrollmentContext();
      res.json({ status: true, data });
    } catch (err) {
      AdminSemesterController.#handleError(err, res);
    }
  }

  static async getEligibleStudents(req, res) {
    try {
      const data = await AdminSemesterService.getEligibleStudents();
      res.json({ status: true, data });
    } catch (err) {
      AdminSemesterController.#handleError(err, res);
    }
  }

//   static async enrollStudent(req, res) {
//     try {
//       const { studentId } = req.body;
//       const data = await AdminSemesterService.enrollStudent({ studentId });
//       res.status(201).json({ status: true, data });
//     } catch (err) {
//       this.#handleError(err, res);
//     }
//   }

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

export { AdminSemesterController };
