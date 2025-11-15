import { useEffect, useState } from "react";
import "./RetrieveAttendance.css"
import { useScreenData } from "../../Layout/Layout";
// import AttendanceHome from "./AttendanceHome";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL;
function RetrieveAttendance(){

  const [attendance, setAttendance] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const screenData= useScreenData()

  useEffect(()=>{
    getAttendenceRecords()
  },[])
  const getAttendenceRecords = async ()=>{
    try {
        const response= await axios.get(`${API_BASE_URL}/class/get-attendance-list`,{
            withCredentials:true
        })
        if(response.data.status){
            // console.log("attendance list is ",response)
            setAttendance(response.data.data)
            setFilteredData(response.data.data)
        }
    } catch (error) {
        console.error(error)
    }
  }

  useEffect(() => {
    let data = attendance;
    if (search) {
      data = data.filter(row =>
        row.subject_name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (subjectFilter) {
      data = data.filter(row => row.subject_name === subjectFilter);
    }
    setFilteredData(data);
  }, [search, subjectFilter, attendance]);

  const subjects = [...new Set(attendance.map(row => row.subject_name))];

  return (
    <div className="attendance-container">
      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search subject..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          className="subject-select"
          value={subjectFilter}
          onChange={e => setSubjectFilter(e.target.value)}
        >
          <option value="">All Subjects</option>
          {subjects.map((sub, idx) => (
            <option key={idx} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}  style={{cursor:"pointer"}}>
                <td>{row.subject_name}</td>
                <td>{new Date(row.date).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`status-badge ${
                      row.status === 1 ? "present" : "absent"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RetrieveAttendance