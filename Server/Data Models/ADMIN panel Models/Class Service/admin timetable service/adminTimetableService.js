import { DomainError } from "../../../../Domain Errors/Grades Module Errors/domainErrors.js";
import ClassRepository from "./Repos/classRepository.js";
import SubjectRepository from "./Repos/SubjectRepository.js";
import TimetableSlotRepository from "./Repos/TimetableSlotRepository.js";


class TimetableService {
  /* ---------- Guards ---------- */

  static #assertSemesterEditable(classEntity, semester) {
    if (classEntity.current_semester !== semester) {
      throw DomainError.invalid("SEMESTER IS LOCKED FOR THIS CLASS");
    }
  }

  static #assertValidTimeRange(startTime, endTime) {
    if (startTime >= endTime) {
      throw DomainError.invalid("INVALID TIME RANGE");
    }
  }

  // static #hasOverlap(slots, startTime, endTime, excludeSlotId = null) {
  //   return slots.some(slot => {
  //     if (!slot.is_active) return false;
  //     if (excludeSlotId && slot.id === excludeSlotId) return false;

  //     return (
  //       startTime < slot.end_time &&
  //       slot.start_time < endTime
  //     );
  //   });
  // }
  static #hasOverlap(slots, startTime, endTime, excludeSlotId = null) {
  return slots.some(slot => {
    if (!slot.is_active) return false;
    if (excludeSlotId && slot.id === excludeSlotId) return false;

    // overlap if ranges intersect
    return !(
      endTime <= slot.start_time || 
      startTime >= slot.end_time
    );
  });
}

  /* ---------- Commands ---------- */

  static async createSlot(cmd) {
    const {
      classId,
      semester,
      dayOfWeek,
      startTime,
      endTime,
      subjectId,
      lectureType,
      lecturerName,
    } = cmd;

    const classEntity = await ClassRepository.findById(classId);
    if (!classEntity) {
      throw DomainError.notFound("CLASS NOT FOUND");
    }

    this.#assertSemesterEditable(classEntity, semester);
    this.#assertValidTimeRange(startTime, endTime);

    const subjectValid =
      await SubjectRepository.existsForClassSemester(
        subjectId,
        classId,
        semester
      );

    if (!subjectValid) {
      throw DomainError.invalid("SUBJECT NOT VALID FOR CLASS SEMESTER");
    }

    const existingSlots =
      await TimetableSlotRepository.findActiveSlotsForDay(
        classId,
        semester,
        dayOfWeek
      );

    if (
      this.#hasOverlap(existingSlots, startTime, endTime)
    ) {
      throw DomainError.invalid("TIME SLOT OVERLAP");
    }

    return TimetableSlotRepository.save({
      class_id: classId,
      semester,
      day_of_week: dayOfWeek,
      start_time: startTime,
      end_time: endTime,
      subject_id: subjectId,
      lecture_type: lectureType,
      lecturer_name: lecturerName ?? null,
      is_active: 1,
    });
  }

  static async updateSlot({ slotId, updates }) {
    console.log("Updates are ",updates)
    console.log("slotId is ",slotId)
    const slot = await TimetableSlotRepository.findById(slotId);
    if (!slot) {
      throw DomainError.notFound("TIMETABLE SLOT NOT FOUND");
    }

    if (!slot.is_active) {
      throw DomainError.invalid("CANNOT UPDATE INACTIVE SLOT");
    }

    const classEntity =
      await ClassRepository.findById(slot.class_id);

    this.#assertSemesterEditable(classEntity, slot.semester);

    const updated = {
      ...slot,
      ...updates};

    this.#assertValidTimeRange(
      updated.start_time,
      updated.end_time
    );

    if (updates.subject_id) {
      const valid =
        await SubjectRepository.existsForClassSemester(
          updated.subject_id,
          slot.class_id,
          slot.semester
        );

      if (!valid) {
        throw DomainError.invalid("SUBJECT NOT VALID FOR CLASS SEMESTER");
      }
    }

    const existingSlots =
      await TimetableSlotRepository.findActiveSlotsForDay(
        slot.class_id,
        slot.semester,
        updated.day_of_week
      );

    if (
      this.#hasOverlap(
        existingSlots,
        updated.start_time,
        updated.end_time,
        slot.id
      )
    ) {
      throw DomainError.invalid("TIME SLOT OVERLAP");
    }

    return TimetableSlotRepository.save(updated);
  }

  static async deleteSlot({ slotId }) {
    const slot = await TimetableSlotRepository.findById(slotId);
    if (!slot) {
      throw DomainError.notFound("TIMETABLE SLOT NOT FOUND");
    }

    if (!slot.is_active) {
      return;
    }

    const classEntity =
      await ClassRepository.findById(slot.class_id);

    this.#assertSemesterEditable(classEntity, slot.semester);

    await TimetableSlotRepository.softDelete(slotId);
  }

  static async restoreSlot({ slotId }) {
    const slot = await TimetableSlotRepository.findById(slotId);
    if (!slot) {
      throw DomainError.notFound("TIMETABLE SLOT NOT FOUND");
    }

    if (slot.is_active) {
      return slot;
    }

    const classEntity =
      await ClassRepository.findById(slot.class_id);

    this.#assertSemesterEditable(classEntity, slot.semester);

    const existingSlots =
      await TimetableSlotRepository.findActiveSlotsForDay(
        slot.class_id,
        slot.semester,
        slot.day_of_week
      );

    if (
      this.#hasOverlap(
        existingSlots,
        slot.start_time,
        slot.end_time
      )
    ) {
      throw DomainError.invalid("TIME SLOT OVERLAP");
    }

    slot.is_active = 1;
    return TimetableSlotRepository.save(slot);
  }

  static async getTimetable({ classId, semester }) {
    const slots =
      await TimetableSlotRepository.findAllForClassSemester(
        classId,
        semester
      );

    return slots.reduce((acc, slot) => {
      acc[slot.day_of_week] ||= [];
      acc[slot.day_of_week].push(slot);
      return acc;
    }, {});
  }
}

export default TimetableService;
