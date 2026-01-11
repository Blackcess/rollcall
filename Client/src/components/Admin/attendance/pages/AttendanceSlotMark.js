import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { 
    getStudents,
    getTodayAttendance,
    saveAttendanceForSlot,
    getClassDetails
 } from "../API/adminAttendanceAPI";
import { toast } from "react-toastify";
import "./AttendanceSlotMark.css"

function AttendanceSlotMark() {
  const { classId, semester, slotId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const subjectId = state?.subjectId;
  const startTime = state?.startTime;
  const subjectName = state?.subjectName || "Subject";

  const [classDetails,setClassDetails] = useState(null)

  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Load students + today's attendance
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const studentList = await getStudents(classId, semester);
        const attendanceToday = await getTodayAttendance(classId, semester);
        if(classId){
          const data = await getClassDetails(classId)
          setClassDetails(()=>{return data})
        }
        

        // Filter only entries relevant to this slot
        const slotRecords = attendanceToday.filter(
          (rec) =>
            rec.subject_id === subjectId &&
            rec.start_time === startTime
        );

        // Initialize map: student_id -> 1 | 0 | null
        const initialMap = {};
        studentList.forEach((student) => {
          const rec = slotRecords.find(
            (r) => r.student_id === student.student_id
          );
          initialMap[student.student_id] =
            rec?.status ?? null; // present=1 | absent=0 | null=unmarked
        });

        setStudents(studentList);
        setAttendanceMap(initialMap);
        setDirty(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load attendance data.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [classId, semester, subjectId, startTime]);

  // Toggles one student's status
  const toggleStatus = (studentId) => {
    setAttendanceMap((prev) => {
      const current = prev[studentId];
      const next =
        current === null ? 1 : current === 1 ? 0 : 1; // Cycle: null -> present -> absent -> present
      const updated = { ...prev, [studentId]: next };
      setDirty(true);
      return updated;
    });
  };

  // Mark all present
  const markAllPresent = () => {
    setAttendanceMap((prev) => {
      const updated = {};
      for (let sid in prev) updated[sid] = 1;
      setDirty(true);
      return updated;
    });
  };

  // Reset all to unmarked
  const resetAll = () => {
    setAttendanceMap((prev) => {
      const updated = {};
      for (let sid in prev) updated[sid] = null;
      setDirty(true);
      return updated;
    });
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const records = Object.entries(attendanceMap)
        .filter(([_, status]) => status !== null) // send only marked
        .map(([student_id, status]) => ({
          student_id: Number(student_id),
          status
        }));

      if (records.length === 0) {
        toast.info("No attendance selected.");
        return;
      }

      await saveAttendanceForSlot({
        classId,
        semester,
        subjectId,
        startTime,
        records
      });

      toast.success("Attendance saved.");
      setDirty(false);

      // Reload state (same effect as refresh)
      const today = await getTodayAttendance(classId, semester);
      const slotRecords = today.filter(
        (r) =>
          r.subject_id === subjectId &&
          r.start_time === startTime
      );
      setAttendanceMap((prev) => {
        const updated = {};
        students.forEach((s) => {
          const rec = slotRecords.find(
            (r) => r.student_id === s.student_id
          );
          updated[s.student_id] = rec?.status ?? null;
        });
        return updated;
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save attendance.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading attendance...</p>;

  return (
    <section className="admin-slot-mark">
      <button onClick={() => navigate(-1)} className="btn">Back</button>

      <div className="slot-meta">
        <h2 className="class-dets-heading">
          <span>Class : {classDetails[0].name}</span> — <span>Semester {semester}</span>
          {dirty && <span className="dirty-dot"></span>}
        </h2>
        <h3>{subjectName} — {startTime}</h3>
      </div>

      <p className="slot-desc">Mark Present/Absent for each student.</p>


      {students.length === 0 && <p>No students found.</p>}

      {students.length > 0 && (
        <>
        <div className="table-wrapper">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Roll</th>
                <th>Student</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((stu) => (
                <tr key={stu.student_id}>
                  <td>{stu.roll_number}</td>
                  <td>{stu.student_name}</td>
                  <td>
                    <StatusBadge
                      value={attendanceMap[stu.student_id]}
                      onClick={() => toggleStatus(stu.student_id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

          <div className="slot-toolbar">
            <button onClick={markAllPresent} className="btn-all-present">Mark All Present</button>
            <button onClick={resetAll} className="btn-reset">Reset All</button>
          </div>

          <button
            disabled={!dirty || saving}
            onClick={handleSubmit}
            className="save-btn"
          >
            {saving ? "Saving..." : "Save Attendance"}
          </button>
        </>
      )}
    </section>
  );
}

// function StatusBadge({ value, onClick }) {
//   let label = "Unmarked";
//   let color = "#aaa";

//   if (value === 1) {
//     label = "Present";
//     color = "green";
//   } else if (value === 0) {
//     label = "Absent";
//     color = "crimson";
//   }

//   return (
//     <span
//       style={{
//         padding: "6px 12px",
//         borderRadius: "6px",
//         backgroundColor: color,
//         color: "white",
//         cursor: "pointer"
//       }}
//       onClick={onClick}
//     >
//       {label}
//     </span>
//   );
// }

function StatusBadge({ value, onClick }) {
  const base = "status-badge";
  const cls =
    value === 1 ? "status-present"
    : value === 0 ? "status-absent"
    : "status-none";

  return (
    <span className={`${base} ${cls}`} onClick={onClick}>
      {value === 1 ? "Present" : value === 0 ? "Absent" : "Unmarked"}
    </span>
  );
}


export default AttendanceSlotMark;
