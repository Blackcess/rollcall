import ClassService from "../../../Data Models/ADMIN panel Models/Class Service/adminClassService.js";
import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors.js";


class AdminClassController {

  static async getAllClasses(req,res){
    try {
      const data = await ClassService.getAllClasses()
      res.status(200).json({data:data})
    } catch (error) {
      AdminClassController.#handleError(err,res)
    }
  }
  static async getClassDetails(req,res){
    try {
      const {id} = req.query
      const data = await ClassService.getClassDetails(parseInt(id))
      res.status(200).json({data:data})
    } catch (error) {
      AdminClassController.#handleError(err, res);
    }
  }
  static async createClass(req, res) {
    try {
      const adminId = req.user.id; // injected by auth middleware

      const payload = {
        ...req.body,
        owner_id: adminId
      };

      const result = await ClassService.createClass(payload);

      res.status(201).json({
        status: true,
        data: result
      });

    } catch (err) {
      AdminClassController.#handleError(err, res);
    }
  }

  static async updateClass(req, res) {
    try {
      const { classId } = req.params;

      await ClassService.updateClass(classId, req.body);

      res.status(200).json({
        status: true
      });

    } catch (err) {
      AdminClassController.#handleError(err, res);
    }
  }

  static async archiveClass(req, res) {
    try {
      const { classId } = req.params;

      await ClassService.archiveClass(classId);

      res.status(200).json({
        status: true
      });

    } catch (err) {
      AdminClassController.#handleError(err, res);
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

export default AdminClassController;