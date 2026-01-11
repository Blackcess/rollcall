import { useEffect, useState } from "react";
import "./AssignmentSolution.css"
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;
const AssignmentSolution = () => {
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let questionId = 32; // Replace with actual question ID prop or state

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/assignments/solution/question/${questionId}`) // your backend route
        if(response.data.status){
            console.log("Solution Data From the database is : ",response.data.data);
             setSolution(response.data.data); // assuming backend returns { solution_html: "<div>...</div>" }
        }
        
       
      } catch (err) {
        console.error(err);
        setError("Failed to load solution.");
      } finally {
        setLoading(false);
      }
    };

    fetchSolution();
  }, []);

  if (loading)
    return <p className="loading-message">Loading solution...</p>;

  if (error)
    return <p className="error-message">Error: {error}</p>;

  if (!solution)
    return <p className="empty-message">No solution found for this question.</p>;

  return (
    <>
         {(!loading) ?<div className="solution-viewer">
            <div
                className="solution-content"
                    dangerouslySetInnerHTML={{ __html: solution[1].solution_html }}
            ></div>
    </div>
    :
    <p className="empty-message">Loading Your Solutions</p>}
    </>
   
  );

      
    }

    export default AssignmentSolution;




   