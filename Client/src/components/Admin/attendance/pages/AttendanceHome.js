import { useEffect, useState } from "react";
import {getTodaySlots, getClassDetails, getAllRegisteredClasses} from "../API/adminAttendanceAPI"
import { useAuth } from "../../../../Aunthentication/AuthProvider";
import { useNavigate } from "react-router-dom";
import "./AttendanceHome.css"

function AttendanceHome_Admin() {
  const [classId, setClassId] = useState("");
  const [semester, setSemester] = useState("");
  const [slots, setSlots] = useState([]);

  const [class_details, setClassDetails] = useState(null)
  const [all_classes,setAllClasses] = useState(null)

  const [loading, setLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const session = useAuth();

  // Optional: auto-fill admin’s default class/semester if you have it
  useEffect(() => {
    try {
      async function loadAllClasses (){
        const data = await getAllRegisteredClasses();
        setAllClasses(()=>{return data})
      }
      loadAllClasses()
      if (session?.userData?.class_id) {
        setClassId(session.userData.class_id);
        async function getClassData (){
          const data = await getClassDetails(session.userData.class_id)
          setClassDetails(()=> {return data})
        }
        getClassData()
      }
      if (session?.userData?.semester) {
        setSemester(session.userData.semester);
      }
    } catch (error) {
      console.error(error)
    }
  }, [session]);

  const loadSlots = async () => {
    if (!classId || !semester) {
      setError("Please select class and semester.");
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const slotData = await getTodaySlots(classId, semester);
      setSlots(slotData);

      setLoadedOnce(true);
    } catch (err) {
      console.error(err);
      setSlots([]);
      setError(
        err?.message ||
          "Failed to fetch timetable slots. Please retry."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (slot) => {
    navigate(
      `/protected/layout/admin/lecture/workspace/${classId}/${semester}/${slot.id}`,
      {
        state: {
          subjectId: slot.subject_id,
          startTime: slot.start_time,
          subjectName: slot.subject_name
        }
      }
    );
  };

  return (
    <section className="admin-attendance-home">
      <h2>Admin Attendance</h2>

      <div className="selector-row">
        {(all_classes)&&
          <>
            <label>Class
            <select 
              onChange={(e)=>setClassId(e.target.value)}
            >
              {
                all_classes.map((c,index)=>{
                  return(
                  <option
                    value= {c.id}
                    key={index*45}
                  >{c.name}</option>
                  )
                })
              }

            </select>
            </label>
          </>
        }

        <label>
          Semester:
          <input
            type="number"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            placeholder="Enter Semester"
          />
        </label>

        <button onClick={loadSlots} disabled={loading} className="btn">
          {loading ? "Loading..." : "Load Timetable"}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {/* Empty state before search */}
      {!loading && !loadedOnce && !error && (
        <p>Select class + semester to view today’s lectures.</p>
      )}

      {/* No lecture scenario */}
      {!loading && loadedOnce && slots.length === 0 && (
        <p>No active lecture slots for today.</p>
      )}

      {/* Slot list */}
      {slots.length > 0 && (
        <div className="slot-list">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="slot-card"
              onClick={() => handleNavigate(slot)}
            >
              <div>
                <h4>{slot.subject_name}</h4>
                <p>{slot.start_time} - {slot.end_time}</p>
              </div>

              <div className="slot-card-right">
              <small>Slot {slot.id}</small>
            </div>
          </div>

          ))}
        </div>
      )}
    </section>
  );
}

export default AttendanceHome_Admin;



