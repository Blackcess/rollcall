import { useContext, useEffect, useState } from "react"
import { lectureContext } from "../../LectureDetails"
import { postLectureComment } from "../../../API/lectureViewAPI";
import { toast } from "react-toastify";
import "./LectureComments.css"

export function LectureComments(){
    const [commentInput, setCommentInput] = useState("");
    const [posting, setPosting] = useState(false);
    const parentContext = useContext(lectureContext)
    const {session,comments,sessionId,setComments} = parentContext
    
    const submitComment = async () => {
        if (!commentInput.trim()) return;
    
        try {
          setPosting(true);
          const saved = await postLectureComment(sessionId, commentInput);
    
          // append new comment to UI
          setComments((prev) => [
            ...prev,
            saved
          ]);
    
          setCommentInput("");
        } catch (err) {
          console.error(err);
          toast.error("Failed to post comment.");
        } finally {
          setPosting(false);
        }
      };
    
    return <>
                <div className="lecture-comments-container">

                
                {/* Comments */}
                <div className="lc-sub">
                    <h3>Comments</h3>
                    <div className="comments-area">
                        {comments.length === 0 && <p>No comments yet.</p>}

                        {comments.map((c) => (
                            <div className="comment-item-ssingle" key={c.id}>
                                <strong>{c.student_name || "Student"}</strong>
                                <p>{c.text}</p>
                                <small>{new Date(c.created_at).toLocaleTimeString()}</small>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comment form */}
                {session.status === "ACTIVE" && (
                    <div className="comment-form">
                        <textarea
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            placeholder="Write a comment"
                        />
                        <button
                            disabled={posting}
                            onClick={submitComment}
                            className="comment-btn"
                        >
                            {posting ? "Posting..." : "Submit Comment"}
                        </button>
                    </div>
                )}

                {session.status !== "ACTIVE" && (
                    <p className="comment-disabled-text">
                        Comments disabled — session not active.
                    </p>
                )}
                </div>
             </>
}