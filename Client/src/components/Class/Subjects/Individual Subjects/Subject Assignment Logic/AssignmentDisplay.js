import React, { useEffect, useState } from "react";
import "./AssignmentDisplay.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import NoItemFoundComponent from "../../../../Util Components/No Items Found/NoItem";

const API_BASE_URL = process.env.REACT_APP_API_URL;
const AssignmentDisplay = () => {
  const {search} = useLocation();
  const queryParams = new URLSearchParams(search);
  const assignment_id = queryParams.get("id");
  const navigate = useNavigate()

  useEffect(()=>{
    getAssignmentQuestions()
  },[])
  // get data from the database.
  const [assignmentData, setAssignmentData] = useState([]);
  const [loading, setLoading] = useState(true);


  const getAssignmentQuestions = async ()=>{
    // API call to get assignment questions and suggested answers
    try {
      const response = await axios.get(`${API_BASE_URL}/assignments/questions?id=${parseInt(assignment_id)}`,{
        withCredentials:true
      });
      if(response.data.status){
        console.log("Assignment Questions:",response.data.data);
        setAssignmentData(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }
  

  const [openQuestionId, setOpenQuestionId] = useState(null);

  const toggleAnswer = (id) => {
    setOpenQuestionId(openQuestionId === id ? null : id);
  };

  return (
    <div className="assignment-container">
      {(!loading)?<div className="assignment-questions">
        {assignmentData.map((q,index) => (
          <div className="question-card" key={q.id}>
            <div className="question-header" onClick={() => toggleAnswer(q.id)}>
              <p><strong></strong> {q.question_text}</p>
              <button className="toggle-btn">
                {openQuestionId === q.id ? "−" : "+"}
              </button>
            </div>

            {openQuestionId === q.id && (
              <div className="answer">
                <p><strong>Marks:</strong> {q.marks || 10}</p>
                <div className="jdhsgggd"><strong>Suggested Answer:</strong> 
                <div className="shshs">
                  {(q.suggested_answer)&& q.suggested_answer.split(".").map((el)=>{
                  return <div key={Math.random()} >{el} </div>
                })}
                </div>
                </div>
                {/* <button className="admin-add-sol-btn" onClick={()=>navigate(`../assignment-management?id=${q.id}`)}>Upload Detailed Solution</button> */}
                {/* <button className="admin-add-sol-btn" onClick={()=>navigate(`../assignment-solution?id=${q.id}`)}>View Solution</button> */}
              </div>
            )}
            
          </div>
        ))}
      </div>
      :
      <p>Loading...</p>}
    </div>
  );
};

export default AssignmentDisplay;
