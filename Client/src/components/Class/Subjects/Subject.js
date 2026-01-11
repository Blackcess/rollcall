import "./Subject.css"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { indexToSemesterSubjectsTable } from "../../../utils_functions/index_to_semester_table";
// import "./Dashboard.css";
import styled from "styled-components";
import { Outlet, useNavigate } from "react-router-dom";
import { DefaultContext } from "react-icons/lib";

const API_BASE_URL = process.env.REACT_APP_API_URL;
export  function SubjectDashboard() {
const [activeTab, setActiveTab] = useState("class");
const [countdown, setCountdown] = useState(0);
const [subjectList,setSubjectList]= useState([])
let [subjectLoaded,setSubjectLoaded] = useState(false)
let navigate = useNavigate()


useEffect(() => {
    getSubjects()
    const target = new Date();
    target.setHours(target.getHours() + 1);
    const timer = setInterval(() => {
    const diff = target - new Date();
    setCountdown(Math.max(0, Math.floor(diff / 1000)));
    }, 1000);
    return () => clearInterval(timer);
}, []);
// get subjects from the backend:
const getSubjects = async ()=>{
    try {
        const response = await axios.get(`${API_BASE_URL}/assets/results/semester/subjects?sem=${5}`)
        if(response.data.status){
            console.log("Acquired Subject Data is ",response.data.results)
            const temp = response.data.results.filter(s=> !['Library','BREAK','VAC'].includes(s.subject_name))
            setSubjectList(temp)
            setSubjectLoaded(true)
        }
    } catch (error) {
        console.error(error)
    }
}


const formatTime = (sec) => {
const h = Math.floor(sec / 3600);
const m = Math.floor((sec % 3600) / 60);
const s = sec % 60;
return `${h}h ${m}m ${s}s`;
};


return <>
    <section className="sub-home">
        {/* <h2>Welcome to the subject section</h2> */}
        <div className="subject-list">
            {
                subjectList.map((sub,index)=>{
                    return (
                        <SubjectTemplate value={{subject:sub}} key={index} onClick={()=>navigate(`individual-course?course_id=${sub.id}`)}>
                            {/* <img src={sub.subject_image} className="subject-tester-image"/> */}
                            <span>{sub.subject_name}</span>
                        </SubjectTemplate>
                    )
                })
            }
        </div>

    </section>

</>

}


const SubjectTemplate= styled.div`
    cursor:pointer;
    padding:15px;
    border:1px solid #ccc;
    border-radius:10px;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    
`


export  function SubjectHome(){


    return <>
    <Outlet/>
    </>
}