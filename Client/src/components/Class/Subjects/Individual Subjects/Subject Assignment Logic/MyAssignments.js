import axios from "axios";
import "./MyAssignments.css"
import React, { use, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import AssignmentCard from "./AssignmentCard";

const API_BASE_URL = process.env.REACT_APP_API_URL;
function AssignmentList() { 

  // get subject assignment from the backend 
  const {search} = useLocation();
  const queryParams = new URLSearchParams(search);
  const course_id = queryParams.get("id");

  // states
  const [assignments,setAssignments] = React.useState([]);
  const [assignmentsLoaded,setAssignmentsLoaded]= useState(false);

  useEffect(()=>{
    getSubjectAssignments()
  },[])

  const getSubjectAssignments= async ()=>{
    //api call to get assignments for the specific subject using the course_id
      try {
        const response = await axios.get(`${API_BASE_URL}/assignments/All?id=${parseInt(course_id)}`,{
          withCredentials:true
        });
        if(response.data.status){
          // console.log("Assignments for the subject",response.data.data);
          setAssignments(response.data.data);
          setAssignmentsLoaded(true);

        }
      } catch (error) {
        console.error(error);
        setAssignmentsLoaded(true); 
      }
  }
  return (
    <>
      {
        (assignmentsLoaded)?<div className="assignments-list-container-ct">
          {assignments.map((a, i) => (
            <AssignmentCard key={i} {...a} />
          ))}
        </div>
      :
      < p>Loading...</p>
      } 
  
    </>
    
  );
}



// assignment card component

const AssignmentCard = ({ id,title, type, issue_date, due_date, status }) => {
  const getStatusClass = () => {
    return status === "active" ? "status-active" : "status-archived";
  };
   const navigation = useNavigate();

  return (
    <div className="assignment-card">
      <div className="assignment-header">
        <h4 className="assignment-title">{title}</h4>
        <span className={`assignment-status ${getStatusClass()}`}>
          {status.toUpperCase()}
        </span>
      </div>

      
        <div className="assignment-info">
          <p><strong>Type:</strong> {type}</p>
          <p><strong>Issued On:</strong> {(issue_date) ? issue_date.split("T")[0]: "" }</p>
          <p><strong>Due Date:</strong> {(due_date) ? due_date.split("T")[0]: ""}</p>
        </div>

      <div className="assignment-footer">
        <button className="view-btn" onClick={()=>navigation(`/protected/layout/class/subjects/individual-course/subject-assignments-display?id=${id}`)}>View Details</button>
        {/* <button className="view-btn">Add Solution</button> */}
      </div>
    </div>
  );
};




export default AssignmentList;
