import express from "express"
import { connection } from "../../database connections/databaseConnect.js";
import { addSolution,getSolutionsByQuestion,updateSolution,deleteSolution } from "../../Data Controllers/Subject Module Controllers/subjectAssignmentController.js";




const assignmentRouter = express.Router()

assignmentRouter.get(`/all`,async (req,res)=>{
    try {
        const {id} = req.query;
        console.log("My id id ",id)
        const [assignments] = await connection.query(`SELECT id, title, description, type, issue_date, due_date, total_marks, status
                                                    FROM assignments WHERE subject_id = ? ORDER BY issue_date DESC`,
                                                [id])
        res.status(200).json({status:true,data:assignments})
    } catch (error) {
        console.error(error)
    }

})
assignmentRouter.get(`/questions`,async (req,res)=>{
    
    try {
        const {id} = req.query;
        const [questions] = await connection.query(`SELECT id, question_text, marks, suggested_answer, question_type
                                                    FROM assignment_questions WHERE assignment_id = ?`,
                                                [id])
        res.status(200).json({status:true,data:questions})
    } catch (error) {
        console.error(error)
    }

})

assignmentRouter.post(`/solution/add`,addSolution);
assignmentRouter.get(`/solution/question/:question_id`,getSolutionsByQuestion);
assignmentRouter.put(`/solution/update/:id`,updateSolution);
assignmentRouter.delete(`/solution/delete/:id`,deleteSolution);



export {assignmentRouter}