import axios from "axios";
import "./AttendanceHome.css"
import { useState,useEffect } from "react";
import { FcCalculator } from "react-icons/fc";
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
                // console.log("Dummy Data = ",res)
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
                console.log("Dummy Data = ",res)
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
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dhd">
          <img  className="attendance-icon" src="https://img.freepik.com/premium-vector/analytics-with-graph-flat-vector-illustration-white-background_674398-2166.jpg"/> 
          Attendance Dashboard
        </h1>
      </header>

      {/* Overall Attendance */}
      {overall && (
        <section className="overall-progress">
          <div className="progress-ring">
            <div className="circle">{overall.percentage}%</div>
            <p>
              {overall.attended} / {overall.total} classes attended
            </p>
            <small>Safe Zone = 75%</small>
          </div>
        </section>
      )}

      <div className="dashboard-grid">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <h2>Subject Attendance</h2>
          <div className="subject-cards">
            {subjects.map((sub, idx) => (
              <div key={idx} className="card">
                <h3>{sub.subject}</h3>
                <div className="mini-circle">{sub.percentage}%</div>
                <p>
                  {sub.attended} / {sub.total} classes
                </p>
              </div>
            ))}
          </div>

          {/* Heatmap */}
          <div className="heatmap">
            <h2>Attendance Heatmap</h2>
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

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="widget streak">
            <span>
              <img className={`streak-image`} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv8-e_FahqzU7s__TalUxn0PUkx4ZKicGJdPI_q-K068Yq9AE&s"/>
            </span>
            <div className="streak-body">
              <h2>
               Streak Tracker
              </h2>
              <p>
               {streak > 0
                 ? `✅ ${streak} days in a row!`
                 : "❌ No streak active"}
             </p>
            </div>

            
          </div>

          <div className="widget">
            <AttendanceCalculators/>
          </div>

          <div className="widget">
            <h2>Predicted Attendance</h2>
            <p>At current pace: 79% by semester end</p>
          </div>

          <div className="widget">
            <h2>Achievements</h2>
            <p>🏅 Perfect Week</p>
            <p>🔥 Comeback King</p>
          </div>
        </div>
      </div>
    </div>
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



export default AttendanceHome