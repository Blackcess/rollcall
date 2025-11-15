import axios from "axios";
import "./AttendanceHome.css"
import { useState,useEffect } from "react";
import { FcCalculator } from "react-icons/fc";
import ShimmerLoader from "../../Util Components/ShimmerLoader/ShimmerLoader";
import { NavLink,useNavigate} from "react-router-dom";
import AttendanceLineChart from "./attendance charts/AttendanceLineChart";
import Courasel from "./Swipper/Swipper";
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

  useEffect(() => {
    // get data from database 
    fetchOverallData()
    fetchDailyData()
  }, []);

//   fetch data
    const fetchOverallData = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/class/attendance-overall`,{
                withCredentials:true
            }) 
            if(res.data.status){
                console.log("Subject  Data => ",res.data.subjects)
                setOverall(res.data.overall);
                setSubjects(res.data.subjects);
            }
        
        } catch (err) {
            console.error("Error fetching data", err);
        }
    };

const fetchDailyData = async ()=>{
    try {
            const res = await axios.get(`${API_BASE_URL}/class/attendance-daily`,{
                withCredentials:true
            }) 
            if(res.data.status && res.data.data){
                // console.log("Dummy Data = ",res)
                setHeatmap(res.data.data)
                 let streakCount = 0;
                for (let i = res.data.data.length - 1; i >= 0; i--) {
                  if (res.data.data[i].status === "present") streakCount++;
                  else break;
                }
                setStreak(streakCount);
                
            }
        
        } catch (err) {
            console.error("Error fetching data", err);
        }
        finally{
          setLoaded(true)
        }
    };

  

  // 🔹 Skip Calculator
  const handleWhatIf = () => {
    if (!overall || whatIf === "") return;
    const skip = parseInt(whatIf, 10);

    const newTotal = overall.total + skip;
    const newAttended = overall.attended; // attended stays same
    const newPercentage = ((newAttended / newTotal) * 100).toFixed(1);

    setPredicted(newPercentage);
  };

  // 🔹 Reverse Calculator (How many classes to reach 75%)
  const handleNeeded = () => {
    if (!overall) return;

    const target = 75; // safe zone
    let attended = overall.attended;
    let total = overall.total;
    let extra = 0;

    // keep adding classes until percentage ≥ target
    while (((attended + extra) / (total + extra)) * 100 < target) {
      extra++;
    }
    setNeeded(extra);
  };

   

  return (
    <>
    <Courasel className="chart-data-cont"/>
    {(loaded) ? <div className="dashboard">
      {/* Overall Attendance */}
      {overall && (
      
        <section className="overall-progress">
          
          <div className="progress-ring">
            <div className="circle" style={{color:(parseInt(overall.percentage)>=50 ? "teal" : "red")}}>{overall.percentage}%</div>
            <small>
              {overall.attended} / {overall.total} classes attended <br/>
            </small>
            <small style={{color:"teal"}}>Safe Zone = 75%</small>
          </div>
           {/* <span className="line-carhat"><AttendanceLineChart value={{subject:"FLAT"}} className="line-cahart"/></span> */}
           <div className="dashboard-header">
        {/* <NavLink to={`/protected/layout/class/class-attendance-record`} className="record-my-attendance">Record Today Attendance</NavLink> */}
        
        <div className="attendance-btns-custom">
          <button onClick={(e)=>{
              Navigation(`/protected/layout/class/class-attendance-record`)
            }} className="mark-btn">
              Record Attendance
          </button>
          <NavLink to={`/protected/layout/class/class-attendance-retrieve`} className="view-btn-cu">View Attendance</NavLink>
        </div>
      </div>
      
      {/*  */}
    
    </section>
      )}
     

      <div className="dashboard-grid">
        {/* LEFT PANEL */}
        <div className="left-panel">
          {/* <h3 className="subject-attendance-header">Subject Attendance</h3> */}
          {/* <div className="subject-cards">
            {subjects.map((sub, idx) => (
              <div key={idx} className="card">
                <h3>{sub.subject}</h3>
                <div className="mini-circle">{sub.percentage}%</div>
                <p>
                  {sub.attended} / {sub.total} classes
                </p>
              </div>
            ))}
          </div> */}
          <AttendanceCardList subjects={subjects}/>

          
        </div>

        {/* RIGHT PANEL */}
        {/* <div className="right-panel"> */}
          {/* <div className="widget streak">
            <span>
              <img className={`streak-image`} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv8-e_FahqzU7s__TalUxn0PUkx4ZKicGJdPI_q-K068Yq9AE&s"/>
            </span>
            <div className="streak-body">
              <h3>
               Streak Tracker
              </h3>
              <p>
               {streak > 0
                 ? `✅ ${streak} days in a row!`
                 : "❌ No streak active"}
             </p>
            </div>

            
          </div> */}

          {/* <div className="widget">
            <AttendanceCalculators/>
          </div> */}

          {/* <div className="widget">
            <h2>Predicted Attendance</h2>
            <p>At current pace: 79% by semester end</p>
          </div> */}

          {/* <div className="widget">
            <h2>Achievements</h2>
            <p>🏅 Perfect Week</p>
            <p>🔥 Comeback King</p>
          </div>  */}
          
        {/* </div> */}
      </div>
        {/* Heatmap */}
          <div className="heatmap">
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
      
      
    </div>
    :
    <ShimmerLoader/>
    }
    </>
  );
}

function AttendanceCalculators({ studentId }) {
  const [attendance, setAttendance] = useState({ attended: 0, total: 0, percentage: 0 });
  const [whatIfResult, setWhatIfResult] = useState(null);
  const [reverseResult, setReverseResult] = useState(null);

  // Fetch overall attendance from DB
  useEffect(() => {
    
    const fetchData = async ()=>{
        try {
            const res= await axios.get(`${API_BASE_URL}/class/attendance-overall`,{
                withCredentials:true
            })
            if(res.data.status){
                // console.log("What the ",res)
                setAttendance(res.data.overall)
            }
        } catch (error) {
            console.error(error)
        }
    }
    fetchData()
  }, []);

  // What-If Calculator: if I skip X more lectures
  const handleWhatIf = (skipCount) => {
    const newTotal = attendance.total + skipCount;
    const newAttended = attendance.attended; // skipping means no more presents
    const newPercentage = ((newAttended / newTotal) * 100).toFixed(2);
    setWhatIfResult(newPercentage);
  };

  // Reverse Calculator: how many lectures can I skip to stay above target %
  const handleReverse = (target) => {
    let extra = 0;
    let percentage = attendance.percentage;

    while (percentage >= target) {
      extra++;
      const newTotal = attendance.total + extra;
      const newPercentage = (attendance.attended / newTotal) * 100;
      if (newPercentage < target) {
        extra--; // went too far
        break;
      }
      percentage = newPercentage;
    }

    setReverseResult(extra);
  };

  return (
    <div className="calculators">
      <h2 className="attendance-calculatoor-head"><FcCalculator style={{fontSize:"32px"}}/>Attendance Calculators</h2>

      <div className="card">
        <h3>What-If Calculator</h3>
        <input
          type="number"
          placeholder="Lectures to skip"
          onChange={(e) => handleWhatIf(parseInt(e.target.value) || 0)}
        />
        {whatIfResult && <p>New attendance: {whatIfResult}%</p>}
      </div>
       

      {/* <div className="card">
        <h3>Reverse Calculator</h3>
        <input
          type="number"
          placeholder="Target %"
          onChange={(e) => handleReverse(parseInt(e.target.value) || 0)}
        />
        {reverseResult !== null && (
          <p>You can skip <b>{reverseResult}</b> more lecture(s).</p>
        )}
      </div> */}
    </div>
  );
}

const AttendanceCardList= ({subjects})=>{

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;
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


const module3 = [`Context-free grammars (CFG) and languages (CFL)`, `Chomsky and Greibach normal forms`,
`nondeterministic pushdown automata (PDA) and equivalence with CFG`, `parse trees`, `ambiguity
in CFG`, `pumping lemma for context-free languages`,  `deterministic pushdown automata`, `closure
properties of CFLs` ]



export default AttendanceHome