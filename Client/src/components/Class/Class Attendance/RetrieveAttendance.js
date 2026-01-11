import { useEffect, useState } from "react";
import "./RetrieveAttendance.css"
import { useScreenData } from "../../Layout/Layout";
import NoItemFoundComponent from "../../Util Components/No Items Found/NoItem";
import { fetchAttendanceRecords } from "./API/attendanceAPI";
import { useAuth } from "../../../Aunthentication/AuthProvider";
// import AttendanceHome from "./AttendanceHome";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL;
function RetrieveAttendance(){

  const [attendance, setAttendance] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const screenData= useScreenData()
  const sessionData = useAuth()

  useEffect(()=>{
    getAttendenceRecords()
  },[])
  const getAttendenceRecords = async ()=>{
    try {
        const {data}  = await fetchAttendanceRecords(sessionData.userData.semester)
        if(data){
            setAttendance(data)
            setFilteredData(data)
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
      { (attendance.length) ? <div className="table-wrapper">
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
      : <NoItemFoundComponent/>
    }
    </div>
  );
}

export default RetrieveAttendance