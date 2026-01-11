import "./AssignmentManagement.css"

import React, { useState } from "react";
import axios from "axios";
import { generateLongSolutionHTML } from "../../../../../../utils_functions/assignmentLongSolutionGenerator";
import { useLocation } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL;
// { questionId, onSuccess }
const AddLongSolutionForm = () => {
  const [question, setQuestion] = useState("");
  const [concept, setConcept] = useState("");
  const [keyPoints, setKeyPoints] = useState([{ title: "", content: "" }]);
  const [explanation, setExplanation] = useState("");
  const [examples, setExamples] = useState([""]);
  const [references, setReferences] = useState([""]);
  const [solutionNumber, setSolutionNumber] = useState(1);
  const [isDefault, setIsDefault] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {search} = useLocation();
  const searchParams = new URLSearchParams(search);
  const questionId = searchParams.get("id");
    // const questionId = 1; 
    const onSuccess = null; // For testing, replace with actual success handler
  // Handlers for dynamic fields
  const handleKeyPointChange = (index, field, value) => {
    const updated = [...keyPoints];
    updated[index][field] = value;
    setKeyPoints(updated);
  };

  const addKeyPoint = () => setKeyPoints([...keyPoints, { title: "", content: "" }]);

  const handleExampleChange = (index, value) => {
    const updated = [...examples];
    updated[index] = value;
    setExamples(updated);
  };

  const addExample = () => setExamples([...examples, ""]);

  const handleReferenceChange = (index, value) => {
    const updated = [...references];
    updated[index] = value;
    setReferences(updated);
  };

  const addReference = () => setReferences([...references, ""]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    // Generate HTML using utility function
    const solutionHTML = generateLongSolutionHTML(
      question,
      concept,
      keyPoints,
      explanation,
      examples,
      references
    );
    // console.log("Generated HTML String: ",solutionHTML);


    try {
      await axios.post(`${API_BASE_URL}/assignments/solution/add`, {
        question_id: questionId,
        solution_number: solutionNumber,
        solution_html: solutionHTML,
        is_default: isDefault,
      },{
        withCredentials: true
      });
      alert("Solution added successfully!");
      // if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to add solution");
    }

  };

  return (<>
    {(!isModalOpen) ?<div className="solutions-form-container">
      <h2>Add Long Solution for Question ID: {questionId}</h2>
      <form onSubmit={()=>{
        setIsModalOpen(true);
      }}>
        <label>Question:</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />

        <label>Concept:</label>
        <input
          type="text"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          required
        />

        <div className="keypoints-section">
          <h3>Key Points:</h3>
          {keyPoints.map((kp, i) => (
            <div key={i} className="keypoint-row">
              <input
                type="text"
                placeholder="Title"
                value={kp.title}
                onChange={(e) => handleKeyPointChange(i, "title", e.target.value)}
              />
              <textarea
                placeholder="Content"
                value={kp.content}
                onChange={(e) => handleKeyPointChange(i, "content", e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={addKeyPoint}>+ Add Key Point</button>
        </div>

        <label>Detailed Explanation:</label>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
        />

        <div className="examples-section">
          <h3>Examples:</h3>
          {examples.map((ex, i) => (
            <input
              key={i}
              type="text"
              placeholder="Example"
              value={ex}
              onChange={(e) => handleExampleChange(i, e.target.value)}
            />
          ))}
          <button type="button" onClick={addExample}>+ Add Example</button>
        </div>

        <div className="references-section">
          <h3>References:</h3>
          {references.map((ref, i) => (
            <input
              key={i}
              type="text"
              placeholder="Reference"
              value={ref}
              onChange={(e) => handleReferenceChange(i, e.target.value)}
            />
          ))}
          <button type="button" onClick={addReference}>+ Add Reference</button>
        </div>

        <label>Solution Number:</label>
        <input
          type="number"
          value={solutionNumber}
          min={1}
          max={10}
          onChange={(e) => setSolutionNumber(Number(e.target.value))}
          required
        />

        <label>
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
          /> Default Solution
        </label>

        <button type="submit" className="submit-btn">Generate & Save Solution</button>
      </form>
    </div>
    :
    <VerifySolutionModal
    isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onConfirm={handleSubmit}
  solutionData={{
    question,
    concept,
    keyPoints,
    explanation,
    examples,
    references
  }}
/>
    }
  </>
    
  );
};




// Confirmation
const VerifySolutionModal = ({ isOpen, onClose, onConfirm, solutionData }) => {
  if (!isOpen) return null;

  const { question, concept, keyPoints, explanation, examples, references } = solutionData;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Verify Solution Data</h2>
        <p>Please review the data before submission:</p>

        <div className="modal-section">
          <h3>Question:</h3>
          <p>{question}</p>
        </div>

        <div className="modal-section">
          <h3>Concept:</h3>
          <p>{concept}</p>
        </div>

        <div className="modal-section">
          <h3>Key Points:</h3>
          <ul>
            {keyPoints.map((kp, idx) => (
              <li key={idx}>
                <strong>{kp.title}:</strong> {kp.content}
              </li>
            ))}
          </ul>
        </div>

        <div className="modal-section">
          <h3>Explanation:</h3>
          <p>{explanation}</p>
        </div>

        {examples.length > 0 && (
          <div className="modal-section">
            <h3>Examples:</h3>
            <ul>
              {examples.map((ex, idx) => (
                <li key={idx}>{ex}</li>
              ))}
            </ul>
          </div>
        )}

        {references.length > 0 && (
          <div className="modal-section">
            <h3>References:</h3>
            <ul>
              {references.map((ref, idx) => (
                <li key={idx}>{ref}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="modal-actions">
          <button className="go-back" onClick={onClose}>
            Go Back
          </button>
          <button className="next" onClick={onConfirm}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLongSolutionForm;