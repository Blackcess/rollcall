import { TimetableRepo } from "../Repos/timetableRepo.js";
import { DomainError } from "../../../../../Domain Errors/Grades Module Errors/domainErrors.js";

export const TimetableService = {
  async getTodaySlots({ classId, semester }) {
    const weekday = new Date()
      .toLocaleDateString("en-EN", { weekday: "long" });

    const slots = await TimetableRepo.findTodaySlots({
      classId,
      semester,
      weekday
    });

    if (!slots.length) {
      throw DomainError.notFound("NO_TIMETABLE_FOR_TODAY");
    }

    return slots;
  }
};
