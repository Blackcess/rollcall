import { ClassRosterRepo } from "./Repos/classRoasterRepo.js";
import { DomainError } from "../../../../Domain Errors/Grades Module Errors/domainErrors.js";

export const ClassRosterService = {
  async getStudents({ classId, semester }) {
    const students = await ClassRosterRepo.findStudents({
      classId,
      semester
    });

    if (!students.length) {
      throw DomainError.notFound("NO_STUDENTS_FOUND_FOR_CLASS");
    }

    return students;
  }
};
