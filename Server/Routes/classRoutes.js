import express from "express";
import { connection,getTimetable,markAttendance } from "../database connections/databaseConnect.js";

const classRouter = express.Router()

classRouter.get("/timetable",async (req,res)=>{
    try {
        const myData = await getTimetable();
        res.status(200).json({status:true,data:myData})
    } catch (error) {
        console.error(error);
        res.status(501).json({status:false})
    }
})
classRouter.post("/mark-subject-attendance",async (req,res)=>{
    if(req.user){
          try {
        const {today,subject,attendance,start_time} = req.body;
        if(!subject || !start_time || !today){
            throw new Error("Invalid data provided");
        }
        const result = await markAttendance(today,subject,req.user.roll_number,attendance,start_time);
        if(result){
            res.status(200).json({status:true,msg:"Attendance marked successfully"});
        }
        else{
            res.status(400).json({status:false,msg:"Failed to mark attendance"});
        }
    } catch (error) {
        console.error("Error marking attendance: ", error.message);
        res.status(500).json({status:false,msg:error.message});
    }
    }
  
})

classRouter.get("/subject-attendance-check",async (req,res)=>{
    if(!req.user){
        return res.status(401).json({status:false,msg:"Unauthorized"});
    }
    try {
        const {subject,start_time} = req.query;
        const mydate = new Date();
        const today = mydate.toISOString().slice(0,10) // Format: YYYY-MM-DD
        const [attendance_stats] = await connection.query(`SELECT * FROM attendance WHERE user_id = ? AND date  = ?`,[req.user.roll_number,today])
        res.status(200).json({status:true,data:attendance_stats});
    } catch (error) {
        console.error("Error fetching attendance status: ", error.message);
        return res.status(500).json({status:false,msg:error.message});
    }
})
classRouter.get("/get-attendance-list",async (req,res)=>{
    if(!req.user){
        return res.status(401).json({status:false,msg:"Unauthorized"});
    }
    try {
        const [result] = await connection.query(`SELECT *
                                FROM attendance 
                                JOIN fifth_sem_subjects
                                ON attendance.subject_id = fifth_sem_subjects.id
                                WHERE user_id=?
                                `,[req.user.roll_number]);
        res.status(200).json({status:true,data:result})
    } catch (error) {
        console.log("Error Fetching Attendance List",error);
        res.status(500).json({status:false,msg:error})
    }
})

classRouter.get("/attendance-recorded-days",async(req,res)=>{
    if(!req.user){
        return res.status(401).json({status:false,msg:"Unauthorized"});
    }
    try {
        const [result] = await connection.query(`SELECT COUNT(DISTINCT date) AS days_recorded
                                                    FROM attendance;
`)
            res.status(200).json({status:true,data:result})
    } catch (error) {
        console.log("Error checking recoded days",error)
        res.status(500).json({status:false,msg:error})
    }
})
classRouter.get("/attendance-overall",async(req,res)=>{
   
        if(!req.user){
            return res.status(401).json({status:false,msg:"Unauthorized"});
        }

        try {
            const [subjects] = await connection.query(`SELECT s.subject_name AS subject,
                                                        COUNT(*) AS total,
                                                        SUM(CASE WHEN a.status=1 THEN 1 ELSE 0 END) AS attended
                                                        FROM attendance a
                                                        JOIN fifth_sem_subjects s ON a.subject_id = s.id
                                                        WHERE a.user_id = ?
                                                        GROUP BY s.id, s.subject_name`,[req.user.roll_number]
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

    classRouter.get("/attendance-daily",async (req,res)=>{
        if(!req.user){
            return res.status(401).json({status:false,msg:"Unauthorized"});
        }

      try {
        const [rows]=await connection.query(`SELECT 
                                                a.date,
                                                MAX(CASE WHEN a.status = 1 THEN 1 ELSE 0 END) AS present_flag
                                                FROM attendance a
                                                WHERE a.user_id = ?
                                                GROUP BY a.date
                                                ORDER BY a.date`,[req.user.roll_number]);
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


