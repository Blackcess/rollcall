// src/components/timetable/TimetableGrid.jsx

import { useEffect } from "react";
import TimetableDayColumn from "./TimetableDayColumn";
import "./TimetableGrid.css"


const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday"
];

export default function TimetableGrid({
  slotsByDay,
  subjects,
  isLocked,
  onSlotUpdated,
  onSlotDeleted,
  onSlotCreated,
  classId,
  semester
}) {
  return (
    <div className="timetable-grid">
      {DAYS.map((day) => (
        <TimetableDayColumn
          key={day}
          dayOfWeek={day}
          slots={slotsByDay[day] || []}
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
  );
}
