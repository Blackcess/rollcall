import { useState } from "react";
import "./GlobalFeedBackBar.css";

export default function GlobalFeedbackBar({ code, message }) {
  const [dismissed, setDismissed] = useState(false);

  if (!code || !message || dismissed) return null;

  const config = resolveFeedbackConfig(code);

  return (
    <div className={`global-feedback-bar ${config.className}`}>
      <div className="gfb-content">
        <strong className="gfb-title">{config.title}</strong>
        <span className="gfb-message">{message}</span>
      </div>

      <button
        className="gfb-close"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

/* -----------------------------
   Internal helpers
----------------------------- */

function resolveFeedbackConfig(code) {
  switch (code) {
    case "SEMESTER_LOCKED":
      return {
        title: "Semester Locked",
        className: "gfb-warning",
      };

    case "CONFLICT":
      return {
        title: "Conflict Detected",
        className: "gfb-error",
      };

    case "NOT_FOUND":
      return {
        title: "Not Found",
        className: "gfb-error",
      };

    case "INVALID_INPUT":
      return {
        title: "Invalid Input",
        className: "gfb-error",
      };

    default:
      return {
        title: "System Message",
        className: "gfb-info",
      };
  }
}
