import { useContext, useEffect, useInsertionEffect, useState } from "react";
import "./SubjectSyllabusRender.css"
import axios from "axios"
import { IndividualCourseContext } from "../IndividualSubject";

const API_BASE_URL = process.env.REACT_APP_API_URL;
function RenderSyllabus(props){
    const [syllabus,setSyllabus] = useState(null);
    const [loading,setLoading] = useState(true)
    const fromParent = useContext(IndividualCourseContext);
    // console.log("Context value in syllabus render is ",fromParent)
    // get subjectwise syllabus

    useEffect(()=>{
        getSyllabus()
    },[])
    const getSyllabus = async()=>{
        try {
            const response = await axios.get(`${API_BASE_URL}/syllabus/subject-wise?subject=${fromParent.subject.subject_name}`,{
                withCredentials:true
            })
            if(response.data.status){
                // console.log("Subject Syllabus is ",response.data.data)
                setSyllabus(response.data.data)
                setLoading(false)
            }
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    if (loading) return <div className="loading">Loading syllabus...</div>;
    if (!syllabus) return <div className="error">No syllabus found</div>;
    
  // Dedupe outcomes for "What you'll learn"
  const uniqueOutcomes = [
    ...new Map(
      syllabus.modules
        .flatMap((m) => m.course_outcomes)
        .map((co) => [co.code, co])
    ).values(),
  ];
    return <>
     
    <div className="syllabus-page">
      {/* <h1 className="subject-title">{syllabus.subject_name} Syllabus</h1> */}

      <section className="outcomes-section">
        <h2>What you'll learn</h2>
        <ul className="outcomes-list">
          {uniqueOutcomes.map((co,index) => (
            <li key={index} className="co-code-list">
              <span className="co-code">{co.code}:</span> 
              <span>{co.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="modules-section">
        {syllabus.modules.map((module,index) => (
          <ModuleAccordion key={index} module={module} />
        ))}
      </section>
    </div>
  
    </>
}


const ModuleAccordion = ({ module }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`module ${open ? "open" : ""}`}>
      <div className="module-header" onClick={() => setOpen(!open)}>
        <div className="module-info">
          <span className="module-number">
            Module {module.module_number}:
          </span>{" "}
          <span className="module-title">{module.module_title}</span>
        </div>
        <div className="toggle-icon">{open ? "−" : "+"}</div>
      </div>

      <div className="module-body">
        <ul className="topics-list">
          {module.topics.map((topic,index) => (
            <li key={index}>{topic.title}</li>
          ))}
        </ul>

        {module.course_outcomes.length > 0 && (
          <div className="module-outcomes">
            <h4>Related Outcomes:</h4>
            <ul>
              {module.course_outcomes.map((co,index) => (
                <li key={index}>
                  <span className="co-code">{co.code}</span> - {co.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};




export default RenderSyllabus