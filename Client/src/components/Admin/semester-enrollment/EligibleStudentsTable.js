import StudentEnrollmentRow from "./StudentEnrollmentRow";
import "./EligibleStudentsTable.css";

export default function EligibleStudentsTable({
  students,
  targetSemester,
  onEnrolled
}) {
  return (
    <div className="students-table-wrapper">
      <table className="students-table">
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Class</th>
            <th>Last Semester</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {students.map(student => (
            <StudentEnrollmentRow
              key={student.studentId}
              student={student}
              targetSemester={targetSemester}
              onEnrolled={onEnrolled}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
