import { useSemesterEnrollment } from "./useSemesterEnrollment";
import SemesterContextHeader from "./SemesterContextHeader";
import EligibleStudentsTable from "./EligibleStudentsTable";
import { useEffect } from "react";
import "../styles/adminButtons.css"
import "../styles/adminGlobalStyles.css"
import "./SemesterEnrollmentPage.css"

export default function SemesterEnrollmentPage() {
  const {
    loading,
    error,
    targetSemester,
    students,
    markEnrolled
  } = useSemesterEnrollment();

  useEffect(()=>{
    console.log("Admin Page Debugging",loading,error,targetSemester,students)
  })

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="enrollment-pg-wrapper">
        <SemesterContextHeader targetSemester={targetSemester} />
        <EligibleStudentsTable
          students={students}
          targetSemester={targetSemester}
          onEnrolled={markEnrolled}
        />
      </div>
      
    </>
  );
}
