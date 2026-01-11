// src/components/timetable/TimetableDayColumn.jsx

import TimetableSlotCard from "./TimetableSlotCard";
import "./TimetableDayColumn.css"

export default function TimetableDayColumn({
  dayOfWeek,
  slots,
  subjects,
  isLocked,
  onSlotUpdated,
  onSlotDeleted,
  onSlotCreated,
  classId,
  semester
}) {
  function handleAddSlot() {
    // Create a local draft slot
    onSlotCreated({
      day_of_week: dayOfWeek,
      start_time: "",
      end_time: "",
      subject_id: subjects[0]?.id || null,
      lecture_type: "theory",
      lecturer_name: null,
      is_active: true,
      __isDraft: true, // client-only marker
      class_id:classId,
      semester:semester
    });
  }

  return (
    <div className="timetable-day-column">
      <div className="day-header">
        <h4>{dayOfWeek}</h4>
      </div>

      <div className="day-slots">
        {slots.length === 0 && (
          <div className="empty-day">
            No slots
          </div>
        )}

        {slots.map((slot) => (
          <TimetableSlotCard
            key={slot.id}
            slot={slot}
            subjects={subjects}
            isLocked={isLocked}
            onSlotUpdated={onSlotUpdated}
            onSlotDeleted={onSlotDeleted}
            onSlotCreated={onSlotCreated}
            classId={classId}
            semester={semester}
          />
        ))}
      </div>

      {!isLocked && (
        <div className="add-slot">
          <button onClick={handleAddSlot}>
            + Add Slot
          </button>
        </div>
      )}
    </div>
  );
}
