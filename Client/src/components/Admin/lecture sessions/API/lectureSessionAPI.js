import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

/**
 * Ensure a session exists or create one.
 * Returns the session row.
 */
export async function ensureSession({
  slotId,
  classId,
  semester,
  subjectId,
  startTime,
  endTime
}) {
   
  const res = await api.post("/Admin/lecture/session/ensure", {
    slotId,
    classId,
    semester,
    subjectId,
    startTime,
    endTime
  });
  return res.data.data;
}

/**
 * Load existing sessioss
 */
export async function getSession(sessionId) {
  const res = await api.get(`/Admin/lecture/session/${sessionId}`);
  return res.data.data;     //return empty array if no session found.
}

/**
 * Update summary/topics/notes
 */
export async function updateSession(sessionId, { summary, topics, extraNotes }) {
  const res = await api.put(`/Admin/lecture/session/${sessionId}`, {
    summary,
    topics,
    extraNotes
  });
  return res.data.data;
}

/**
 * Close session (no more comments/uploads)
 */
export async function closeSession(sessionId) {
  const res = await api.post(`/Admin/lecture/session/${sessionId}/close`);
  return res.data.data;
}

/**
 * Upload a file to this session
 * FormData builder → expects `file` key
 */
export async function uploadFileToSession(sessionId, file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post(
    `/Admin/lecture/session/${sessionId}/files`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" }
    }
  );

  return res.data.data;
}

/**
 * Get list of files
 */
export async function getSessionFiles(sessionId) {
  const res = await api.get(`/Admin/lecture/session/${sessionId}/files`);
  return res.data.data;
}

/**
 * Get student comments
 */
export async function getSessionComments(sessionId) {
  const res = await api.get(`/Admin/lecture/session/${sessionId}/comments`);
  //  console.log("Returned Data is (API DEBBUGER)",res.data.data)
  return res.data.data;
}
