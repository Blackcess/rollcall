import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  ensureSession,
  getSession,
  updateSession,
  closeSession,
  uploadFileToSession,
  getSessionFiles,
  getSessionComments
} from "../API/lectureSessionAPI";
import { getClassDetails } from "../../attendance/API/adminAttendanceAPI";
import { toast } from "react-toastify";

import "./SessionWorkspace.css"; // we will create this soon

const API_BASE_URL = process.env.REACT_APP_API_URL;
function SessionWorkspace() {
  const { classId, semester, slotId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const subjectId = location.state?.subjectId;
  const startTime = location.state?.startTime;
  const subjectName = location.state?.subjectName || "Subject";
  const endTime = location.state?.endTime || ""; // optional

  const [sessionId, setSessionId] = useState(null);

  const [summary, setSummary] = useState("");
  const [topics, setTopics] = useState("");
  const [extraNotes, setExtraNotes] = useState("");

  const [files, setFiles] = useState([]);
  const [comments, setComments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [closing, setClosing] = useState(false);

  const [classMeta,setClassMeta] = useState(null)

  // 1) ensure session exists + load initial data
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);

        const session = await ensureSession({
          slotId,
          classId,
          semester,
          subjectId,
          startTime,
          endTime
        });

        setSessionId(session.id);

        const fetched = await getSession(session.id);
        setSummary(fetched.summary || "");
        setTopics(fetched.topics || "");
        setExtraNotes(fetched.extra_notes || "");

        const fileList = await getSessionFiles(session.id);
        setFiles(fileList);

        const commentList = await getSessionComments(session.id);
        setComments(commentList);

        const [data] = await getClassDetails(classId)
        setClassMeta(()=>{
          return data
        })

      } catch (err) {
        console.error(err);
        toast.error(`Failed to load session data.`);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [slotId, classId, semester, subjectId, startTime, endTime]);

  // Save metadata
  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await updateSession(sessionId, {
        summary,
        topics,
        extraNotes
      });
      toast.success("Session details saved");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save session");
    } finally {
      setSaving(false);
    }
  };

  // Close session: no more editing/commenting
  const handleClose = async () => {
    if (!window.confirm("Close session? Students can no longer comment.")) return;

    try {
      setClosing(true);
      await closeSession(sessionId);
      toast.success("Session closed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to close session");
    } finally {
      setClosing(false);
    }
  };

  // Upload file
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const updatedList = await uploadFileToSession(sessionId, file);
      setFiles(updatedList);
      toast.success("File uploaded");
    } catch (err) {
      console.error(err);
      toast.error("File upload failed");
    }
  };

  if (loading) return <p>Loading session...</p>;

  return (
    <section className="session-workspace">
      
      <header className="session-header">
        <div className="session-titles">
          <h2>{subjectName}</h2>
          <p className="session-meta">
            <span>Class {classMeta.name}</span> 
            <span>Sem {semester} — {startTime}</span>
          </p>
        </div>

        <div className="session-actions">
          <button onClick={handleSave} disabled={saving} className="btn btn-primary">
            {saving ? "Saving..." : "Save"}
          </button>
          <button onClick={handleClose} disabled={closing} className="btn btn-danger">
            {closing ? "Closing..." : "Close Session"}
          </button>
        </div>
      </header>

      <div className="workspace-grid">
        
        {/* LEFT PANEL — editors */}
        <div className="left-panel">
          <div className="panel-section">
            <label>Lecture Summary</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Explain what was covered..."
            />
          </div>

          <div className="panel-section">
            <label>Topics Covered</label>
            <textarea
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              placeholder="Topic bullets, concepts, etc"
            />
          </div>

          <div className="panel-section">
            <label>Extra Notes</label>
            <textarea
              value={extraNotes}
              onChange={(e) => setExtraNotes(e.target.value)}
              placeholder="Any additional lecture outcomes"
            />
          </div>
        </div>

        {/* RIGHT PANEL — files + comments */}
        <div className="right-panel">
          <div className="panel-section">
            <label>Files</label>
            <input type="file" onChange={handleFileUpload} />
            <ul className="file-list">
              {files.map((f) => (
                <li key={f.id}>
                  <a href={API_BASE_URL + f.file_url} target="_blank" rel="noopener noreferrer">
                    {f.file_name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel-section">
            <label>Student Comments</label>
            <div className="comments-box">
              {comments.length === 0 && <p>No comments yet</p>}
              {comments.map((c) => (
                <div key={c.id} className="comment-item">
                  <strong>{c.student_name}</strong>
                  <p>{c.text}</p>
                  <small>{(c.created_at)? c.created_at.split("T")[1].split(".")[0]: ""}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="session-footer">
        <button
          className="btn btn-secondary"
          onClick={() =>
            navigate(`/protected/layout/admin/attendance/slot-mark/${classId}/${semester}/${slotId}`, {
              state: { subjectId, startTime, subjectName }
            })
          }
        >
          Go to Attendance
        </button>
      </footer>

    </section>
  );
}

export default SessionWorkspace;
