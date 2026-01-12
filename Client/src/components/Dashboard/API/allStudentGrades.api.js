import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

export async function getSemesterResults (student_id,semester){
    const res  = await api.get(`Student/results/semester?student_id=${student_id}&semester=${semester}`)
    return res.data
}

// export async function getAllSemesterData(student_id){
//     const res = await api.get()
// }