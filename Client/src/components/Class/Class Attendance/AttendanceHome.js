import axios from "axios";
import "./AttendanceHome2.css"
import { useState,useEffect } from "react";
import { FcCalculator } from "react-icons/fc";
import ShimmerLoader from "../../Util Components/ShimmerLoader/ShimmerLoader";
import { NavLink,useNavigate} from "react-router-dom";
import AttendanceLineChart from "./attendance charts/AttendanceLineChart";
import Courasel from "./Swipper/Swipper";
import { fetchOverallData } from "./API/attendanceAPI";
import { fetchDailyData } from "./API/attendanceAPI";
import { useAuth } from "../../../Aunthentication/AuthProvider";
const API_BASE_URL = process.env.REACT_APP_API_URL;

function AttendanceHome(){

    return <>
    <section className="">
        <AttendanceDashboard1/>
    </section>
    
    </>
}


function AttendanceDashboard1() {
  const [overall, setOverall] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [streak, setStreak] = useState(0);
  const [whatIf, setWhatIf] = useState(""); // skip input
  const [predicted, setPredicted] = useState(null);
  const [needed, setNeeded] = useState(null); // reverse calculator result
  const [loaded,setLoaded] = useState(false)
  const Navigation = useNavigate()
   const sessionData = useAuth()

  useEffect(() => {
    // get data from database 
    
    // fetchDailyData()
    async function loadData(){
      try {
      // const {overall:overallData,subjects} = fetchOverallData()
      // const data = fetchDailyData()
      

      const [{overall:overallData,subjects}, data] = await Promise.all([
        fetchOverallData(sessionData.userData.semester),
        fetchDailyData(),
      ]);
  
      setOverall((prev)=>{
        return overallData
      })
      setSubjects(()=>{
        return subjects
      })
      setHeatmap(()=>{
        return data
      })
      let streakCount = 0;
      for (let i = data.length - 1; i >= 0; i--) {
        if (data[i].status === "present") streakCount++;
        else break;
      }
      setStreak(streakCount);
    } catch (error) {
      console.error("Error fetching data", error);
    }
    finally{
      setLoaded(true)
    }
    }
    loadData()
  }, []);
 

  return (
    <>
    { (loaded) &&
    <div className="attendance-page">
    <Courasel className="chart-data-cont"/>
    {(loaded) ? <div className="dashboard">
      {/* Overall Attendance */}
      {overall && (
      
        <section className="overall-progress">
          
          <div className="progress-ring">
            <div className="circle" style={{color:(parseInt(overall.percentage)>=50 ? "white" : "red")}}>{overall.percentage}%</div>
            <small>
              {overall.attended} / {overall.total} classes attended <br/>
            </small>
            <small >Safe Zone = 75%</small>
          </div>
           {/* <span className="line-carhat"><AttendanceLineChart value={{subject:"FLAT"}} className="line-cahart"/></span> */}
           <div className="dashboard-header">
        {/* <NavLink to={`/protected/layout/class/class-attendance-record`} className="record-my-attendance">Record Today Attendance</NavLink> */}
        
        <div className="attendance-btns-custom">
          <button onClick={(e)=>{
              Navigation(`/protected/layout/class/class-attendance-record`)
            }} className="mark-btn">
              Today's Lectures
          </button>
          <NavLink to={`/protected/layout/class/class-attendance-retrieve`} className="view-btn-cu">View Attendance</NavLink>
        </div>
      </div>
    
    </section>
      )}
     

      {(overall && subjects.length)?<div className="dashboard-grid">
        {/* LEFT PANEL */}
        <div className="left-panel">
         <AttendanceCardList subjects={subjects}/>
        </div>
      </div> :
      <p></p>}
      
        {/* Heatmap */}
          {( overall && subjects.length) ?<div className="heatmap">
            <h3>Attendance Heatmap</h3>
            <div className="heatmap-grid">
              {heatmap.map((d, i) => (
                <div
                  key={i}
                  className={`day ${d.status}`}
                  title={`Day ${i+1}: ${d.status}`}
                >
                  {i+1}
                </div>
              ))}
            </div>
          </div>
          :
          <p></p>}
    </div>
    :
    <ShimmerLoader/>
    }
  
  </div>
}
    </>
  );
}

const AttendanceCardList= ({subjects})=>{

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 3;
  // Calculate total pages
  const totalPages = Math.ceil(subjects.length / cardsPerPage);
  
  // Calculate slice indexes
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  // Get current page data
  const currentSubjects = subjects.slice(startIndex, endIndex);
   // Handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return <>
  <section className="subject-cards">
     {currentSubjects.map((sub, idx) => (
          <div key={idx} className="card">
            <h3>{sub.subject}</h3>
            <div className="mini-circle">{sub.percentage}%</div>
            <p>
              {sub.attended} / {sub.total} classes
            </p>
          </div>
        ))}

        
  </section>
  <div className="pagination-controls">
        <button onClick={goToPrevPage} disabled={currentPage === 1}>
          ← Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next →
        </button>
      </div>
  </>
}
export default AttendanceHome