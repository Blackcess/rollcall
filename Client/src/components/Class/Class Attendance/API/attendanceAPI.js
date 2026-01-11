import axios from "axios";


const API_BASE_URL = process.env.REACT_APP_API_URL;
const api = axios.create({
  baseURL: API_BASE_URL, // or your API_BASE_URL
  withCredentials: true
});


// fetch overal data
export const fetchOverallData = async (semester) => {
    const res = await api.get(`Student/class/attendance-overall?semester=${semester}`)
    return res.data
};

export const fetchDailyData = async ()=>{
    const res = await api.get(`Student/class/attendance-daily`)
    return res.data.data
}

export const getTimetable = async (semester,classId) =>{
    const res = await api.get(`Student/class/timetable?semester=${semester}&classId=${classId}`)
    return res.data
}

export const recordAttendance = async ({today,subject,attendance,start_time,student_id,semester,class_id})=>{
    const res = await api.post(`Student/class/mark-subject-attendance`,{
        today,
        subject,
        attendance,
        start_time,
        student_id,
        semester,
        class_id
    })
    return res.data
}

export const checkubjectAttendance = async (student_id,class_id)=>{   // this function checks if the subject attendance is marked for a student(X)
    const res = await api.get(`Student/class/subject-attendance-check?student_id=${student_id}&class_id=${class_id}`)
    return res.data
}
export const fetchAttendanceRecords = async (semester)=>{   //this function fetches all attendance records for student(X) in semester (y)
    const res = await api.get(`Student/class/get-attendance-list?semester=${semester}`)
    return res.data
}
