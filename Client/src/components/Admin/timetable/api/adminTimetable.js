// src/api/adminTimetable.js

import axios from "axios";


const API_BASE_URL = process.env.REACT_APP_API_URL;
const api = axios.create({
  baseURL: API_BASE_URL, // or your API_BASE_URL
  withCredentials: true
});

// Fetch Subjects
export async function fetchSubjects(semester){
    const res = await api.get(`/Student/subjects?semester=${parseInt(semester)}` )
    // console.log("Subjects from request:",res.data)
    return res.data.data
}



/* ---------------- Fetch Timetable ---------------- */

export async function fetchTimetable(classId, semester) {
  const res = await api.get(`/admin/classes/${classId}/semesters/${semester}/timetable` )
  return res.data;
}

/* ---------------- Create Slot ---------------- */

export async function createSlot({
  classId,
  semester,
  dayOfWeek,
  startTime,
  endTime,
  subjectId,
  lectureType,
  lecturerName,
}) {
  
  const res = await api.post(`/admin/classes/${classId}/semesters/${semester}/timetable/slots`,
    {
      dayOfWeek,
      startTime,
      endTime,
      subjectId,
      lectureType,
      lecturerName,
    })
  return res.data;
}

/* ---------------- Update Slot ---------------- */

export async function updateSlot(slotId, updates) {
  console.log("slotId is jd", slotId)
  const res = await api.patch(
    `/admin/classes/_/semesters/_/timetable/slots/${slotId}`,
    updates
  );
  return res.data;
}

/* ---------------- Delete Slot (Soft) ---------------- */

export async function deleteSlot(slotId) {
  await api.delete(
    `/admin/classes/_/semesters/_/timetable/slots/${slotId}`
  );
}

/* ---------------- Restore Slot ---------------- */

export async function restoreSlot(classId,semester,slotId) {
  const res = await api.post(
    `/admin/classes/${classId}/semesters/${semester}/timetable/slots/${slotId}/restore`
  );
  return res.data;
}

