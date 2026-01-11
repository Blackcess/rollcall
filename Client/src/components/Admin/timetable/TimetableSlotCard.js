// src/components/timetable/TimetableSlotCard.jsx

import { useState } from "react";
import { 
    createSlot,
    updateSlot,
    deleteSlot,
    restoreSlot

 } from "./api/adminTimetable";
 import "./TimetableSlotCard.css"
import { useEffect } from "react";

const INITIAL_ERROR = null;

export default function TimetableSlotCard({
  slot,
  subjects,
  isLocked,
  onSlotUpdated,
  onSlotDeleted,
  onSlotCreated,
  classId,
  semester
}) {
  const isCreateMode = slot.__isDraft === true;

  const [mode, setMode] = useState(
    isCreateMode ? "CREATE" : "VIEW"
  );

  const [draft, setDraft] = useState({
    day_of_week: slot.day_of_week,
    start_time: slot.start_time || "",
    end_time: slot.end_time || "",
    subject_id: slot.subject_id,
    lecture_type: slot.lecture_type || "theory",
    lecturer_name: slot.lecturer_name || "",
    class_id:classId,
    semester:semester
  });

  const [error, setError] = useState(INITIAL_ERROR);

  /* ---------------- Helpers ---------------- */

  function updateDraft(field, value) {
    setDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function basicValidation() {
    if (!draft.start_time || !draft.end_time) {
      return "Start time and end time are required";
    }
    if (draft.start_time >= draft.end_time) {
      return "End time must be after start time";
    }
    if (!draft.subject_id) {
      return "Subject is required";
    }
    return null;
  }

  /* ---------------- Actions ---------------- */

  async function handleSave() {
    const validationError = basicValidation();
    if (validationError) {
      setError({ message: validationError });
      return;
    }

    setMode("SAVING");
    setError(null);

    try {
      if (isCreateMode) {
        const created = await createSlot({
          classId: classId,
          semester: semester,
          dayOfWeek: draft.day_of_week,
          startTime: draft.start_time,
          endTime: draft.end_time,
          subjectId: draft.subject_id,
          lectureType: draft.lecture_type,
          lecturerName: draft.lecturer_name || null,
        });

        onSlotCreated(created);
      } else {
        const updated = await updateSlot(slot.id, {
          day_of_week: draft.day_of_week,
          start_time: draft.start_time,
          end_time: draft.end_time,
          subject_id: draft.subject_id,
          lecture_type: draft.lecture_type,
          lecturer_name: draft.lecturer_name || null,
        });

        onSlotUpdated(updated);
      }

      setMode("VIEW");
    } catch (err) {
      const apiError = err?.response?.data;
      console.error(err)
      setError({
        message:
          apiError?.message ||
          "Failed to save slot",
      });
      setMode("ERROR");
    }
  }

  async function handleDelete() {
    if (isCreateMode) {
      onSlotDeleted(slot.id);
      return;
    }

    setMode("SAVING");

    try {
      await deleteSlot(slot.id);
      onSlotDeleted(slot.id);
    } catch (err) {
      setError({
        message: "Failed to delete slot",
      });
      setMode("ERROR");
    }
  }

  async function handleRestore() {
    setMode("SAVING");

    try {
      const restored = await restoreSlot(slot.id);
      onSlotUpdated(restored);
      setMode("VIEW");
    } catch (err) {
      setError({
        message: "Failed to restore slot",
      });
      setMode("ERROR");
    }
  }

  function handleCancel() {
    if (isCreateMode) {
      onSlotDeleted(slot.id);
    } else {
      setDraft({
        day_of_week: slot.day_of_week,
        start_time: slot.start_time,
        end_time: slot.end_time,
        subject_id: slot.subject_id,
        lecture_type: slot.lecture_type,
        lecturer_name: slot.lecturer_name || "",
      });
      setError(null);
      setMode("VIEW");
    }
  }

  /* ---------------- Render ---------------- */

  if (mode === "VIEW") {
    return (
      <div className="slot-card view">
        <div className="slot-time">
          {slot.start_time} – {slot.end_time}
        </div>

        <div className="slot-subject">
          {
            subjects.find(
              (s) => s.id === slot.subject_id
            )?.name
          }
        </div>

        <div className="slot-meta">
          {slot.lecture_type}
          {slot.lecturer_name &&
            ` • ${slot.lecturer_name}`}
        </div>

        {!isLocked && (
          <div className="slot-actions">
            <button onClick={() => setMode("EDIT")}>
              Edit
            </button>
            <button onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`slot-card edit ${
    isCreateMode ? "create" : ""
  }`}>
      {error && (
        <div className="slot-error">
          {error.message}
        </div>
      )}

      <div className="field">
        <label>Start</label>
        <input
          type="time"
          value={draft.start_time}
          onChange={(e) =>
            updateDraft("start_time", e.target.value)
          }
          disabled={mode === "SAVING"}
        />
      </div>

      <div className="field">
        <label>End</label>
        <input
          type="time"
          value={draft.end_time}
          onChange={(e) =>
            updateDraft("end_time", e.target.value)
          }
          disabled={mode === "SAVING"}
        />
      </div>

      <div className="field">
        <label>Subject</label>
        <select
          value={draft.subject_id}
          onChange={(e) =>
            updateDraft(
              "subject_id",
              Number(e.target.value)
            )
          }
          disabled={mode === "SAVING"}
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Lecture Type</label>
        <select
          value={draft.lecture_type}
          onChange={(e) =>
            updateDraft(
              "lecture_type",
              e.target.value
            )
          }
        >
          <option value="theory">
            Theory
          </option>
          <option value="practical">
            Practical
          </option>
        </select>
      </div>

      <div className="field">
        <label>Lecturer</label>
        <input
          type="text"
          value={draft.lecturer_name}
          onChange={(e) =>
            updateDraft(
              "lecturer_name",
              e.target.value
            )
          }
        />
      </div>

      <div className="slot-actions">
        <button
          onClick={handleSave}
          disabled={mode === "SAVING"}
        >
          Save
        </button>
        <button
          onClick={handleCancel}
          disabled={mode === "SAVING"}
        >
          Cancel
        </button>

        {!isCreateMode && (
          <button
            onClick={handleDelete}
            disabled={mode === "SAVING"}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
