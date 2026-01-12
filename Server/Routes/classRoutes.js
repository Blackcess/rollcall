import express from "express";
import { connection,getTimetable,markAttendance } from "../database connections/databaseConnect.js";
import { getTimetableController } from "../Data Controllers/Class Module Controllers/Timetable Controllers/getTimeTableController.js";
import { attachUserRoles } from "../Middlewares/attachRolesMiddleWare.js";
import { authenticationMiddleware } from "../Middlewares/authenticationMiddleware.js";
import { DomainError } from "../Domain Errors/Grades Module Errors/domainErrors.js";
import { requireRole } from "../Middlewares/recquireRole.middleware.js";
import { requireClassAccess } from "../Middlewares/recquireClassAccess.js";
const classRouter = express.Router()
classRouter.get("/timetable",authenticationMiddleware,attachUserRoles,getTimetableController);

classRouter.post("/mark-subject-attendance",authenticationMiddleware,async (req,res)=>{
        try {
            const {today,subject,attendance,start_time,semester,class_id,student_id} = req.body;
            if(!subject || !start_time || !today || !student_id || !semester || !class_id ){
                throw DomainError.invalid("Invalid_data_provided");
            }
        
            const result = await markAttendance(today,subject,req.user.roll_number,attendance,start_time,student_id,semester,class_id);
            if(result){
                res.status(200).json({status:true,msg:"Attendance marked successfully"});
            }
            else{
                res.status(400).json({status:false,msg:"Failed to mark attendance"});
            }
    } catch (error) {
        console.error("Error marking attendance: ", error);
        res.status(500).json({status:false,msg:error.message});
    }
})

classRouter.get("/subject-attendance-check",attachUserRoles,authenticationMiddleware,async (req,res)=>{
    
    try {
        const {student_id,class_id} = req.query;
        if(!student_id && !class_id){
            throw DomainError.invalid("INVALID_PARAMETERS")
        }
        const mydate = new Date();
        const today = mydate.toISOString().slice(0,10) // Format: YYYY-MM-DD
        const [attendance_stats] = await connection.query(`
            SELECT * FROM attendance 
            WHERE student_id = ? 
            AND date  = ?
            AND class_id = ?
            AND semester= ?
            `,[student_id,today,class_id, req.user.semester])
        res.status(200).json({status:true,data:attendance_stats});
    } catch (error) {
        console.error("Error fetching attendance status: ", error);
        return res.status(500).json({status:false,msg:error.message});
    }
})
classRouter.get("/get-attendance-list",attachUserRoles,authenticationMiddleware,async (req,res)=>{
    
    try {
        const {semester }= req.query
        if(!semester){
            throw DomainError.invalid("PARAMETERS_RECQUIRED")
        }
        const [result] = await connection.query(`SELECT attendance.*,
                                subjects.name AS subject_name
                                FROM attendance 
                                JOIN subjects
                                ON attendance.subject_id = subjects.id
                                WHERE attendance.student_id=?
                                AND attendance.semester=?
                                `,[req.user.student_id,semester]);
        res.status(200).json({status:true,data:result})
    } catch (error) {
        console.log("Error Fetching Attendance List",error);
        res.status(500).json({status:false,msg:error})
    }
})
classRouter.get("/attendance-recorded-days",async(req,res)=>{
    try {
        const [result] = await connection.query(`
            SELECT COUNT(DISTINCT date) AS days_recorded
            FROM attendance;
        `)
        res.status(200).json({status:true,data:result})
    } catch (error) {
        console.log("Error checking recoded days",error)
        res.status(500).json({status:false,msg:error})
    }
})
classRouter.get("/attendance-overall",attachUserRoles,authenticationMiddleware,async(req,res)=>{
        try {
            const {semester,classId}= req.query
            if(!semester){
                throw DomainError.invalid("SEMESTER AND CLASSID SHOULD INCLUDED AS PARAMETERS")
            }
            const [subjects] = await connection.query(`
                SELECT s.name AS subject,
                COUNT(*) AS total,
                SUM(CASE WHEN a.status=1 THEN 1 ELSE 0 END) AS attended
                FROM attendance a
                JOIN subjects s ON a.subject_id = s.id
                WHERE a.student_id = ? AND s.semester =? AND s.class_id = ?
                GROUP BY s.id, s.name`,[req.user.student_id,semester,req.user.class_id]
                ) 
            
            // Overall
            const overallTotal = subjects.reduce((sum, s) => sum + parseInt(s.total), 0);
            const overallAttended = subjects.reduce((sum, s) => sum + parseInt(s.attended), 0);
            const overallPercentage = overallTotal > 0
            ? ((overallAttended / overallTotal) * 100).toFixed(1) 
            : 0;
            // console.log("Overall data is ",overallPercentage)
            res.json({
                status:true,
                overall: {
                    total: overallTotal,
                    attended: overallAttended,
                    percentage: overallPercentage
                },
                subjects: subjects.map(s => ({
                    subject: s.subject,
                    total: s.total,
                    attended: s.attended,
                    percentage: ((s.attended / s.total) * 100).toFixed(1)
                }))
    });
            
        } catch (error) {
            console.error(error)
            res.status(500).json({status:false,msg:error})
        }
    })

    classRouter.get("/attendance-daily",attachUserRoles,authenticationMiddleware,async (req,res)=>{
      try {
        const [rows]=await connection.query(`SELECT 
                                                a.date,
                                                MAX(CASE WHEN a.status = 1 THEN 1 ELSE 0 END) AS present_flag
                                                FROM attendance a
                                                WHERE a.student_id = ?
                                                AND semester= ?
                                                GROUP BY a.date
                                                ORDER BY a.date`,[req.user.student_id,req.user.semester]);
            const daily = rows.map(r => ({
                                date: r.date,
                                status: r.present_flag === 1 ? "present" : "absent"
                }));
                // console.log("Daily Data is ",daily)
                res.status(200).json({status:true,data:daily})
        } catch (error) {
        console.error(error)
        res.status(500).json({status:false,msg:error})
      }
    })



export default classRouter


