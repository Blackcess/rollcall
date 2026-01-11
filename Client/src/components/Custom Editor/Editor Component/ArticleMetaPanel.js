import "./ArticleMetaPanel.css"
import { indexToSemesterSubjectsTable } from "../../../utils_functions/index_to_semester_table";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { VscAdd } from "react-icons/vsc";

const API_BASE_URL = process.env.REACT_APP_API_URL;
const ArticleMetaPanel = ({ metadata, onChange,controlRelation, relationsState }) => {
  const [subjects, setSubjects] = useState([]);
  const [subjetcLoaded,setSubjectLoaded] = useState(false)


  // Fetch subjects (you'll handle the backend yourself)
  useEffect(() => {
   fetchSubjects()
  }, []);

  const fetchSubjects= async ()=>{

    try {
        const res = await axios.get(`${API_BASE_URL}/assets/results/semester/subjects?table=${"fifth_sem_subjects"} `,{
            withCredentials:true
        })
        if(res.data.status){
            // console.log("Shit this is my Subjects",res.data.results)
            setSubjects(res.data.results)
            setSubjectLoaded(true)
        }
    } catch (error) {
        console.error("Error Fetching Subjects",error)
    }
  }
  const handleChange = (field, value) => {
    const updated = { ...metadata, [field]: value };
    onChange && onChange(updated);
  };

  return (
    <div className="meta-panel">
      <h3 className="meta-title">Article Metadata</h3>

      <div className="meta-field">
        <label>Title</label>
        <input
          type="text"
          value={metadata.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter article title"
        />
      </div>

      <div className="meta-field">
        <label>Subject</label>
        <select
          value={metadata.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
        >
          <option value="">Select subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.subject_name}
            </option>
          ))}
        </select>
      </div>

      <div className="meta-field">
        <label>Thumbnail URL (optional)</label>
        <input
          type="url"
          value={metadata.thumbNailUrl}
          onChange={(e) => handleChange("thumbNailUrl", e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="meta-field">
        <label>Description</label>
        <textarea
          value={metadata.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Short summary of this article..."
        />
      </div>

      <div className="meta-field">
        <label>Tags</label>
        <input
          type="text"
          value={metadata.tags}
          onChange={(e) => handleChange("tags", e.target.value)}
          placeholder="e.g. networking, osi, tcp/ip"
        />
      </div>

      {/* <div className="create-relation-with-external-articles">
        <button className="save-btn" onClick={()=>{
            controlRelation(!relationsState)
        }}>
            <VscAdd />
            {(!relationsState) ?"Link with other articles" : "Go Back To Editor"}
        </button>
      </div> */}

      <div className="meta-toggle">
        <label>Published:</label>
        <input
          type="checkbox"
          checked={metadata.isPublished}
          onChange={(e) => handleChange("isPublished", e.target.checked)}
        />
      </div>

      <button
        className="save-btn"
        onClick={() => console.log("Metadata preview:", metadata)}
      >
        Preview Meta
      </button>
      
    </div>
  );
};

export default ArticleMetaPanel;
