import { NavLink, Outlet, useLocation } from "react-router-dom"
import "./IndividualSubject.css"
import axios from "axios";
import { useEffect, useState,createContext,useContext } from "react";
import { indexToSemesterSubjectsTable } from "../../../../utils_functions/index_to_semester_table";
import styled from "styled-components";
import { AiFillPropertySafety } from "react-icons/ai";
import RenderSyllabus from "./Subject Syllabus Logic/SubjectSyllabusRender";
import AssignmentDisplay from "./Subject Assignment Logic/AssignmentDisplay";
import AssignmentSolution from "./Subject Assignment Logic/AssignmentSolution";

const API_BASE_URL = process.env.REACT_APP_API_URL;
const IndividualCourseContext = createContext();
function IndividualSubject(){
    let location = useLocation();
    let searchParams = new URLSearchParams(location.search)
    let course_id= searchParams.get("course_id")
    // console.log("Relative course id",course_id)

    //get the specific subject
    const [subject,setSubject]= useState({})
    const [subjectLoded,setSubjectLoaded] = useState(false)
    useEffect(()=>{
        getSpecificSubject()
    },[])

    const getSpecificSubject = async ()=>{
        try {
            const response= await axios.get(`${API_BASE_URL }/assets/results/semester/specific/subject?id=${parseInt(course_id)}&sem=${5}`,{
                withCredentials:true
            })
            if(response.data.status){
                // console.log("This is the specific subjets needed",response.data.results)
                setSubject(response.data.results[0])
                setSubjectLoaded(true)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return <>
        {(subjectLoded) ?
        <section className="subject-individual-container">
            <SubjectImageDisplay value={{subject}}>

            </SubjectImageDisplay>
            <IndividualCourseContext.Provider value={{subject}}>
                 <Outlet/>
            </IndividualCourseContext.Provider>
           
            {/* <RenderSyllabus value ={{subject}}/> */}
           
            {/* <AssignmentDisplay/> */}
            {/* <AssignmentSolution/> */}
        </section>
        :
        <p>Loading...</p>
        }
    </>
}

export const SubjectImageDisplay= styled.div`
height:200px;
width:100%;
position:relative;
border-radius:10px;
// background: linear-gradient(45deg, rgba(142, 197, 252, 1.000) 0.000%, rgba(141, 211, 255, 1.000) 25.000%, rgba(161, 216, 255, 1.000) 50.000%, rgba(193, 210, 255, 1.000) 75.000%, rgba(224, 195, 255, 1.000) 100.000%);
    background-image:linear-gradient(
       rgba(69, 68, 68, 0.5),   
       rgba(0, 0, 0, 0.5)
     ),url("${(props)=>{
        // console.log("Lets do this ",props)
    return props.value.subject.subject_image}}");
    background-size:cover;
    background-position:center;
    transition: width 0.3s ease;

    &::after{
    position:absolute;
    content:"${(props)=>{return props.value.subject.subject_name}}";
    left:0;
    top:50%;
    color:#fff;
    font-size:28px;
    font-weight:700;
    letter-spacing:1px;
    padding:20px;
    }

`

function SelectCourseOptions(){
    const {subject}= useContext(IndividualCourseContext)
    // console.log("This is the subject in select course options ",subject)
    const pages= ["Syllabus","Assignments","Announcements","timetable","exams"]
    const paths= ["subject-syllabus",`subject-assignments?id=${subject.id}`,"","",""]
    return <div className="courseSelection-opt">
         <div className="subject-individual-page-options">
                {
                    pages.map((page,index)=>{
                        return <NavLink key={index} to={`${paths[index]}`}>{page}</NavLink>
                    })
                }
            </div>

    </div>
}



export {IndividualSubject,SelectCourseOptions,IndividualCourseContext}; 