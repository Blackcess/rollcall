import React from "react";
import "./SemesterContextHeader.css";

function SemesterContextHeader({ targetSemester }) {
  if (!targetSemester) return null;

  return (
    <div className="semester-context">
      <div className="semester-context__label">
        Active Enrollment Context
      </div>
      <div className="semester-context__value">
        Semester {targetSemester}
      </div>
    </div>
  );
}

export default SemesterContextHeader;
