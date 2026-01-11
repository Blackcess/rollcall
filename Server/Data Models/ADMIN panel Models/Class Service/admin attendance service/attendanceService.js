import { AttendanceRepo } from "./Repos/attendanceRepo.js";
import { DomainError } from "../../../../Domain Errors/Grades Module Errors/domainErrors.js";

export const AttendanceService = {
  async getToday({ classId, semester }) {
    const date = new Date().toISOString().slice(0, 10);

    return await AttendanceRepo.findTodayRecords({
      classId,
      semester,
      date
    });
  },

  async bulkMark({ actorId, classId, semester,subject_id,start_time, records }) {
    const date = new Date().toISOString().slice(0, 10);

    if (!records?.length) {
      throw DomainError.invalid("NO_RECORDS_TO_SAVE");
    }

    const result = await AttendanceRepo.bulkUpsert({
      classId,
      semester,
      date,
      actorId,
      subject_id,
      start_time,
      records
    });

    return {
      inserted: result.affectedRows,
      updated: result.changedRows
    };
  }
};
