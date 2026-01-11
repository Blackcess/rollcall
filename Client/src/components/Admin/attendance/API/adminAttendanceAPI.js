import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

/**
 * Fetch today's timetable slots for a specific class + semester
 * GET /Admin/class/:classId/semester/:semester/timetable-today
 */
export async function getTodaySlots(classId, semester) {
  const res = await api.get(
    `/Admin/attendance/class/${classId}/semester/${semester}/timetable-today`
  );
  return res.data.data;
}

/**
 * Fetch all students enrolled in class + semester
 * GET /Admin/class/:classId/semester/:semester/students
 */
export async function getStudents(classId, semester) {
  const res = await api.get(
    `/Admin/attendance/class/${classId}/semester/${semester}/students`
  );
  return res.data.data;
}

/**
 * Fetch today's attendance (all slots). Frontend must filter by slot.
 * GET /Admin/attendance/today?classId=&semester=
 */
export async function getTodayAttendance(classId, semester) {
  const res = await api.get(
    `/Admin/attendance/today?classId=${classId}&semester=${semester}`
  );
  return res.data.data;
}

/**
 * Bulk mark attendance for ONE slot:
 * POST /Admin/attendance/bulk
 *
 * payload = {
 *   class_id,
 *   semester,
 *   subject_id,
 *   start_time,
 *   records: [
 *     { student_id, status }
 *   ]
 * }
 */
export async function saveAttendanceForSlot({
  classId,
  semester,
  subjectId,
  startTime,
  records
}) {

  const payload = {
    class_id: classId,
    semester,
    subject_id:subjectId,
    start_time:startTime,
    records
  };

  const res = await api.post(`/Admin/attendance/bulk`, payload);
  return res.data;

}
export const getClassDetails = async (classId)=>{
  const res  = await api.get(`/admin/classes/details?id=${classId}`)
  return res.data.data
}
export const getAllRegisteredClasses = async ()=>{
  const res  = await api.get(`/admin/classes/all`)
  console.log("Response from the API layer is ", res.data.data)
  return res.data.data
}