import axios from "axios";


const API_BASE_URL = process.env.REACT_APP_API_URL;
const api = axios.create({
  baseURL: API_BASE_URL, // or your API_BASE_URL
  withCredentials: true
});

export async function getSemesterContext() {
  try {
    const res = await api.get("/admin/semester/context");
    return res.data.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export async function getEligibleStudents() {
  try {
    const res = await api.get("/admin/semester/eligible-students");
    return res.data.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}


export async function enrollStudent(classId, studentId, semesterNumber) {
  try {
    const res = await api.post(
      `/admin/enrollments/semester/${classId}/${studentId}`,
      { semesterNumber }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}
