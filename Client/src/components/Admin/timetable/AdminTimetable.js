// src/pages/admin/AdminTimetablePage.jsx

import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import { fetchTimetable } from "./api/adminTimetable";
import { fetchSubjects } from "./api/adminTimetable";
import TimetableHeader from "./TimetableHeader";
import TimetableGrid from "./TimetableGrid";
import GlobalFeedbackBar from "./GlobalFeedBackBar";
import "./AdminTimetable.css"
import SpinLoader from "../../Util Components/SpinLoader/SpinLoader";
/* ---------------- Constants ---------------- */

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday"
];

function emptySlotsByDay() {
  return DAYS.reduce((acc, day) => {
    acc[day] = [];
    return acc;
  }, {});
}

function normalizeSlots(input) {
  const byDay = emptySlotsByDay();

  if (!input) {
    return byDay;
  }

  // Case 1: backend returns array of slots
  if (Array.isArray(input)) {
    input.forEach((slot) => {
      if (byDay[slot.day_of_week]) {
        byDay[slot.day_of_week].push(slot);
      }
    });
  }

  // Case 2: backend returns object keyed by day
  else if (typeof input === "object") {
    Object.entries(input).forEach(([day, slots]) => {
      if (byDay[day] && Array.isArray(slots)) {
        byDay[day].push(...slots);
      }
    });
  }

  // Always sort
  DAYS.forEach((day) => {
    byDay[day].sort((a, b) =>
      a.start_time.localeCompare(b.start_time)
    );
  });

  return byDay;
}

/* ---------------- Component ---------------- */

export default function AdminTimetablePage() {
  const { classId, semester } = useParams();

  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  const [slotsByDay, setSlotsByDay] = useState(emptySlotsByDay());
  const [subjects, setSubjects] = useState([]);

  const [globalError, setGlobalError] = useState(null);

  /* ---------------- Data Load ---------------- */

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      setGlobalError(null);

      try {
        const [subjectsRes, timetableRes] = await Promise.all([
          fetchSubjects(semester),
          fetchTimetable(Number(classId), Number(semester)),
        ]);
      

        if (!isMounted) return;

        setSubjects(subjectsRes);

        const normalized = normalizeSlots(timetableRes);
        //   console.log("Normalized shit is ")
        setSlotsByDay(normalized);
        setIsLocked(false);
        
      } catch (err) {
        if (!isMounted) return;

        const apiError = err?.response?.data;

        if (
          apiError?.code === "INVALID_INPUT" &&
          apiError?.message?.includes("LOCKED")
        ) {
          setIsLocked(true);
        } else {
          setGlobalError({
            code: apiError?.code || "UNKNOWN_ERROR",
            message:
              apiError?.message ||
              "Failed to load timetable",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [classId, semester]);

  /* ---------------- Slot Mutators ---------------- */

  const replaceSlot = useCallback((updatedSlot) => {
    setSlotsByDay((prev) => {
      const next = structuredClone(prev);

      // Remove slot from any day it exists in
      DAYS.forEach((day) => {
        next[day] = next[day].filter(
          (s) => s.id !== updatedSlot.id
        );
      });

      // Insert into correct day
      next[updatedSlot.day_of_week].push(updatedSlot);

      // Re-sort
      next[updatedSlot.day_of_week].sort((a, b) =>
        a.start_time.localeCompare(b.start_time)
      );

      return next;
    });
  }, []);

  const removeSlot = useCallback((slotId) => {
    setSlotsByDay((prev) => {
      const next = structuredClone(prev);

      DAYS.forEach((day) => {
        next[day] = next[day].filter(
          (s) => s.id !== slotId
        );
      });

      return next;
    });
  }, []);

  const addSlot = useCallback((newSlot) => {
    
    setSlotsByDay((prev) => {
      const next = structuredClone(prev);

      next[newSlot.day_of_week].push(newSlot);
      next[newSlot.day_of_week].sort((a, b) =>
        a.start_time.localeCompare(b.start_time)
      );

      return next;
    });
  }, []);

  /* ---------------- Render ---------------- */

if (loading) {
  return (
    <div className="admin-timetable-page admin-timetable-page--loading">
      <SpinLoader/>
      Loading timetable…
    </div>
  );
}

 return (
  <div className="admin-timetable-page">
    <TimetableHeader
      classId={Number(classId)}
      semester={Number(semester)}
      isLocked={isLocked}
    />

    {globalError && (
      <GlobalFeedbackBar
        code={globalError.code}
        message={globalError.message}
      />
    )}

    <TimetableGrid
      slotsByDay={slotsByDay}
      subjects={subjects}
      isLocked={isLocked}
      onSlotUpdated={replaceSlot}
      onSlotDeleted={removeSlot}
      onSlotCreated={addSlot}
      classId={classId}
      semester={semester}
    />
  </div>
);

}
