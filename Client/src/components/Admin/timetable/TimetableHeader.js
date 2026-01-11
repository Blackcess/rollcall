import "./TimetableHeader.css"
import { CiEdit } from "react-icons/ci";
import { ImEyeBlocked } from "react-icons/im";
export default function TimetableHeader({ classId, semester, isLocked }) {
  return (
    <div className="timetable-header">
      <div className="th-left">
        <h2 className="th-title">Timetable Management</h2>

        <div className="th-context">
          <span className="th-chip">Class ID: {classId}</span>
          <span className="th-chip">Semester {semester}</span>
        </div>
      </div>

      <div className="th-right">
        {isLocked ? (
          <span className="th-lock locked">
            <ImEyeBlocked/> Semester Locked
          </span>
        ) : (
          <span className="th-lock unlocked">
            <CiEdit/> Editable
          </span>
        )}
      </div>
    </div>
  );
}
