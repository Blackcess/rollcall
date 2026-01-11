import { useState } from "react";
import { enrollStudent } from "./api/adminSemester";
import "./StudentEnrollmentRow.css";

export default function StudentEnrollmentRow({
  student,
  targetSemester,
  onEnrolled
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEnroll = async () => {
    if (!student.eligible || loading) return;

    setLoading(true);
    setError(null);

    try {
      await enrollStudent(
        student.classId,
        student.studentId,
        targetSemester
      );
      onEnrolled(student.studentId);
    } catch (err) {
      setError(err?.error?.message || "Enrollment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr
      className={`student-row ${
        student.eligible ? "" : "student-row--disabled"
      }`}
    >
      <td>{student.rollNumber}</td>

      <td className="student-name">{student.name}</td>

      <td>{student.className}</td>

      <td>{student.lastCompletedSemester}</td>

      <td>
        {student.eligible ? (
          <span className="status-badge-enroll status-badge-enroll--eligible">
            Eligible
          </span>
        ) : (
          <span className="status-badge-enroll status-badge-enroll--blocked">
            {student.eligibilityReason}
          </span>
        )}
      </td>

      <td className="action-cell">
        <button
          className={`enroll-btn ${
            student.eligible ? "enroll-btn--primary" : "enroll-btn--disabled"
          }`}
          disabled={!student.eligible || loading}
          onClick={handleEnroll}
        >
          {loading ? "Enrolling…" : "Enroll"}
        </button>

        {error && <div className="row-error">{error}</div>}
      </td>
    </tr>
  );
}
