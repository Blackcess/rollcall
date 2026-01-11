import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../Aunthentication/AuthProvider";
import { getTodayStudentSessions } from "../API/lectureViewAPI";
// import "./LectureFeed.css";

function LectureFeed() {
  const navigate = useNavigate();
  const session = useAuth();

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [error, setError] = useState(null);

  const classId = session?.userData?.class_id;
  const semester = session?.userData?.semester;

  useEffect(() => {
    async function load() {
      if (!classId || !semester) return;
      try {
        setLoading(true);
        setError(null);

        const data = await getTodayStudentSessions(classId, semester);
        setSlots(data);
        setLoadedOnce(true);
      } catch (err) {
        console.error(err);
        setError("Failed to load today's lectures.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [classId, semester]);

  const goToDetail = (sessionId, slotId) => {
    // If there is no sessionId yet, student can still enter to see comments disabled
    navigate(
      `/protected/layout/student/lectures/session/${sessionId || "none"}`,
      {
        state: {
          slotId
        }
      }
    );
  };

  return (
    <section className="student-lecture-feed">
      <h2>Today's Lectures</h2>

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Error */}
      {!loading && error && (
        <p className="feed-error">{error}</p>
      )}

      {/* Pre-search state */}
      {!loading && !loadedOnce && !error && (
        <p>Fetching your classes for today...</p>
      )}

      {/* No result */}
      {!loading && loadedOnce && slots.length === 0 && (
        <p>No lectures scheduled today.</p>
      )}

      {/* Slot list */}
      {slots.length > 0 && (
        <div className="slot-feed-list">
          {slots.map((slot) => (
            <div
              key={slot.id}
            //   className={`slot-feed-card state-${slot.state.toLowerCase()}`}
              className={`slot-feed-card`}
              onClick={() => goToDetail(slot.sessionId, slot.slotId)}
            >
              <div className="card-info">
                <h4>{slot.subject_name}</h4>
                <p>{slot.start_time}</p>
              </div>

              <div className="card-state">
                <StatusPill state={slot.state} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function StatusPill({ state }) {
  let colorClass = "pill-grey";
  if (state === "ACTIVE") colorClass = "pill-green";
  if (state === "CLOSED") colorClass = "pill-red";

  return (
    <span className={`state-pill ${colorClass}`}>
      {state}
    </span>
  );
}

export default LectureFeed;
