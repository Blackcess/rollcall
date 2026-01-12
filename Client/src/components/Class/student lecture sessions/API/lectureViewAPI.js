import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

/**
 * Get today's lecture timetable + session status  
 * Combines `timetable_slots` with any active/closed sessions
 * Response: array of { slotId, time, subjectName, sessionId|null, state }
 */
export async function getTodayStudentSessions(classId, date) {
  const res = await api.get(
    `/Student/lecture/session/${classId}/${date}`
  );
  return res.data.data;
}

/**
 * Get lecture session details (summary, topics, notes, status)
 */
export async function getLectureDetails(sessionId) {
  const res = await api.get(
    `/Student/lecture/session/${sessionId}`
  );

  return res.data.data;
}

/**
 * Get student + staff comments for a session
 */
export async function getLectureComments(sessionId) {
  
  const res = await api.get(
    `/Student/lecture/session/${sessionId}/comments`
  );
  return res.data.data;
}

/**
 * Post a student comment
 * text: string
 */
export async function postLectureComment(sessionId, text) {
  const res = await api.post(
    `/Student/lecture/session/${sessionId}/comments`,
    { commentText:text }
  );
  return res.data.data;
}

export async function  getSemesterSubjects(subjectId) {
  const res = await api.get(`/Student/subjects/subject-by-id?subjectId=${subjectId}`)
  return res.data  //destructured as {subject}
}

export async function getLectureFiles(sessionId){
  const res = await api.get(`/Student/lecture/session/${sessionId}/files`)
  console.log("Retuened data is ", res)
  return res.data.data
}