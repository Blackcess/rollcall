import { useEffect, useState } from "react";
import { getEligibleStudents, getSemesterContext,enrollStudent } from "./api/adminSemester";


export function useSemesterEnrollment() {
  const [loading, setLoading] = useState(true);
  const [targetSemester, setTargetSemester] = useState(null);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const context = await getSemesterContext();
        const students = await getEligibleStudents();

        setTargetSemester(context.targetSemester);
        setStudents(students);
      } catch (err) {
        setError(err?.error?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const markEnrolled = (studentId) => {
    setStudents(prev =>
      prev.map(s =>
        s.studentId === studentId
          ? { ...s, eligible: false, eligibilityReason: "ENROLLED" }
          : s
      )
    );
  };

  return {
    loading,
    error,
    targetSemester,
    students,
    markEnrolled
  };
}
