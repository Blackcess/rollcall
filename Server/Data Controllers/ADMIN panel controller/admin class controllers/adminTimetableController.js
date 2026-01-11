import { DomainError } from "../../../Domain Errors/Grades Module Errors/domainErrors.js";
import TimetableService from "../../../Data Models/ADMIN panel Models/Class Service/admin timetable service/adminTimetableService.js";

class AdminTimetableController {
  /* ---------------- READ ---------------- */

  static async getTimetable(req, res) {
    try {
      const { classId, semester } = req.params;
      if(!classId || !semester){
        throw DomainError.invalid("INVALID_REQUEST_PARAMETERS")
      }
      const timetable = await TimetableService.getTimetable({
        classId: Number(classId),
        semester: Number(semester),
      });

      res.status(200).json(timetable);
    } catch (err) {
      AdminTimetableController.#handleError(err, res);
    }
  }

  /* ---------------- CREATE ---------------- */

  static async createSlot(req, res) {
    try {
      const { classId, semester } = req.params;
      const {
        dayOfWeek,
        startTime,
        endTime,
        subjectId,
        lectureType,
        lecturerName,
      } = req.body;
      if(!dayOfWeek || !startTime || !endTime || !subjectId || !lectureType || !lecturerName, !classId, !semester){
        throw  DomainError.invalid("MISSING_BODY_PARAMETERS")
      }

      const slot = await TimetableService.createSlot({
        classId: Number(classId),
        semester: Number(semester),
        dayOfWeek,
        startTime,
        endTime,
        subjectId: Number(subjectId),
        lectureType,
        lecturerName,
      });

      res.status(201).json(slot);
    } catch (err) {
      AdminTimetableController.#handleError(err, res);
    }
  }

  /* ---------------- UPDATE ---------------- */

  static async updateSlot(req, res) {
    try {
      const { slotId } = req.params;

      if(!slotId){
        throw DomainError.invalid("Invalid_SLOT_ID")
      }

      const updates = {
        ...req.body,
      };

      // Normalize numeric fields if present
      if (updates.subject_id !== undefined) {
        updates.subject_id = Number(updates.subject_id);
      }

      const slot = await TimetableService.updateSlot({
        slotId: Number(slotId),
        updates,
      });

      res.status(200).json(slot);
    } catch (err) {
      AdminTimetableController.#handleError(err, res);
    }
  }

  /* ---------------- DELETE (SOFT) ---------------- */

  static async deleteSlot(req, res) {
    try {
      const { slotId } = req.params;

      await TimetableService.deleteSlot({
        slotId: Number(slotId),
      });

      res.status(204).send();
    } catch (err) {
      AdminTimetableController.#handleError(err, res);
    }
  }

  /* ---------------- RESTORE ---------------- */

  static async restoreSlot(req, res) {
    try {
      const { slotId } = req.params;
      
      const slot = await TimetableService.restoreSlot({
        slotId: Number(slotId),
      });

      res.status(200).json(slot);
    } catch (err) {
      AdminTimetableController.#handleError(err, res);
    }
  }

  /* ---------------- ERROR HANDLER ---------------- */

  static #handleError(err, res) {
    if (err instanceof DomainError) {
      return res.status(err.status).json({
        code: err.code,
        message: err.message,
      });
    }

    console.error("Unexpected error:", err);

    return res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "Unexpected error occurred",
    });
  }
}

export default AdminTimetableController;
