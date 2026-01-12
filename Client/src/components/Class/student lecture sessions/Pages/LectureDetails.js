import { createContext, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation, NavLink, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getLectureDetails,
  getLectureComments,
  postLectureComment,
  getSemesterSubjects,
  getLectureFiles
} from "../API/lectureViewAPI";
import { getSessionComments, getSessionFiles } from "../../../Admin/lecture sessions/API/lectureSessionAPI";
import "./LectureDetails.css";
import { SubjectImageDisplay } from "../../Subjects/Individual Subjects/IndividualSubject";

export const lectureContext = createContext()
function LectureDetail() {
  const { sessionId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([])
  
  

  const [subjectMeta,setSubjectMeta] = useState(null)

  const slotId = state?.slotId;
  const navLinkTags = ["Summary","Topics", "Notes", "Files", "Comments"]
  const navDestinations= ["summary",'topics','notes','files','comments']
  

  // Load session details + comments
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        // If "none" was passed, there is no session created yet
        if (sessionId === "none") {
          setSession({
            status: "NOT_STARTED",
            summary: "",
            topics: "",
            notes: "",
            files: []
          });
          setComments([]);
          return;
        }

        const data = await getLectureDetails(sessionId);
        setSession(data);
        // const commentData = await getLectureComments(sessionId);
        const commentData = await getSessionComments(sessionId);
        setComments(commentData);
        const {subject} = await getSemesterSubjects(data.subject_id)
        setSubjectMeta(()=>{return subject})
        const lectureFiles = await getSessionFiles(sessionId)
        setFiles(()=>{return lectureFiles})
        // console.log("file metadata is ",lectureFiles)
      } catch (err) {
        console.error(err);
        toast.error("Failed to load lecture details.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [sessionId]);


  if (loading) return (
    <section className="lecture-detail">
      <p>Loading session...</p>
    </section>
  );
  if(!session){
    return <p>Not Responding</p>
  }

  return<>
  {(subjectMeta && session) ? <section className="lecture-detail">
      {/* <button className="back-btn" onClick={() => navigate(-1)}>
        Back
      </button> */}
      <SubjectImageDisplay value={{subject:subjectMeta}}>
         {/* Status */}
        <div className={`session-status status-${session.status}`}>
          {session.status}
        </div>
      </SubjectImageDisplay>

     <div className="lecture-nav-links"> 
        {
          navLinkTags.map((row,index)=>{
            return <NavLink className={`lecture-details-nav-tag`} to={`${navDestinations[index]}`}>
              {row}
            </NavLink>
          })
        }
     </div>
      
      <lectureContext.Provider value = {{
        session,
        comments,
        subjectMeta,
        slotId,
        sessionId,
        setComments,
        files:files
      }}>
        <Outlet/>
      </lectureContext.Provider>
      
        
     

        {/* Notes */}
        


      
    </section>
    
    :
    <p>Loading Today's Lectures</p>}

     </>

  
}

export default LectureDetail;
