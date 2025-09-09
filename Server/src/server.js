import "../Chat Sockets/ChatSockets.js"
import express from 'express';
import "express-async-errors";
import fs from 'fs';
import cors from 'cors';
import "dotenv/config"
import {connection, getFromUserName,getStudentResults,getStudentSemesterSubjects,getPassedFromSubject,getFailedFromSubject,createStudentAccount,addProfilePicture,retrieveProfile,enquireStudentPersonalInfo,addCredentials,getUserName,getAllStudents,getFollowersDetails,getActivatedStudentsChats,getTimetable,markAttendance} from '../database connections/databaseConnect.js';
import session from "express-session"
import { Cookie } from 'express-session';
import passport from "passport"
import "../Passport Aunthentication Logic/passportStrategy.js"
import { sessionStore } from '../database connections/databaseConnect.js';
import multer from 'multer';
import path from 'path';
import { Server } from 'socket.io';
import { mySocketLogic } from "../Chat Sockets/ChatSockets.js";

import { createServer } from 'http';
// import  bcrypt from "bycrpt"
import "../database connections/databaseConnect.js"
import { connect } from "http2";
import classRouter from "../Routes/classRoutes.js";


const app =express();
// app.set("trust proxy", 1);

const corsOptions = {
  origin: function (origin, callback) {
    const allowedBase = [
      'https://rollcall.vercel.app',
      "rollcall-77s5-2kcst8dea-thomas-kazondas-projects.vercel.app",
      'http://localhost:3000'
    ];

    // Allow anything ending with .vercel.app (preview deploys)
    const isVercelPreview = origin?.endsWith('.vercel.app');

    if (!origin || allowedBase.includes(origin) || isVercelPreview) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};



app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret:"login-secret",
    store:sessionStore,
    saveUninitialized: false,
    resave:false,
    cookie: {
    // httpOnly:true,
    // secure: true,// required for sameSite: 'None'
    // sameSite: 'none',   // allows cross-origin cookies
    maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
  }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use("/class",classRouter)
app.use("/uploads",express.static("uploads"))
//setting up multer storage engine
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        const dir = './uploads';
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        cb(null,dir);
    },
    filename:(req,file,cb)=>{
        const userId = req.user.roll_number;
        const ext = path.extname(file.originalname);
        cb(null,`${userId}-${Date.now()}${ext}`);
    },
})

 function imageFileFilter(req,file,cb){
    //Accept files with the MIME type  of image
    if(file.mimetype.startsWith("image/")){
        cb(null,true);
    }
    else{
        throw new Error("Only Image Files Are Allowed")
    }
 }
const upload = multer({storage:storage,
                    fileFilter:imageFileFilter
});  


// console.log("My Session  Store...", sessionStore)

app.post("/login",passport.authenticate("local"),(req,res)=>{
    

    try {
        console.log("Request from ",req.user);
        res.status(200).json({status:true,msg:"You are logged in"});
    } catch (error) {
        console.error("Error during login: ", error.message);
        res.status(500).json({status:false,msg:"Login failed",error:error.message});
    }

})
app.post("/create-account",async(req,res)=>{
    const {roll_number,password,confirm_password} = req.body;   
    console.log("Roll Number: ",roll_number," Password: ",password," Confirm Password:",confirm_password);
    if(roll_number && password && confirm_password){
        try {
            const result = await createStudentAccount(roll_number,password,confirm_password)
            if(result){
                return res.status(200).json({status:true,msg:"Account created successfully"})
            }
        } catch (error) {
            console.log("Error creating account: ",error.message)
            return res.status(500).json({status:false,error:error.message})
        }
            
    }
    else{
        return res.status(400).json({status:false,error:"Please provide all required fields"})
    }
})
app.get('/cookie-test', (req, res) => {
  req.session.test = 'value';
  console.log("My eq cookie ",req.session.test)
  res.json({ message: 'cookie set' });
});
app.get("/logout",(req,res)=>{
    console.log("Logging out...")
    req.logout((err)=>{
        if(err) {
            console.error("Error logging out: ", err);
            return res.status(500).json({status:false,msg:"Logout failed"});
        }
        req.session.destroy((err)=>{
            if(err){
                console.error("Error destroying session: ", err);
                return res.status(500).json({status:false,msg:"Session destruction failed"});
            }
            console.log("Session destroyed successfully");
            res.clearCookie('connect.sid');
            // res.redirect("http://localhost:3000/");
            return res.json({status:true,msg:"You are logged out"})
        })
       
    })
})
app.get("/",(req,res)=>{
    res.json({msg: "Loser, you are not authorized to use my resources..."})
})
app.get("/checkAuth",(req,res)=>{
    if(req.user){
        console.log("user session is ",req.user,"session->",req.session);
        res.status(200).json({status:true,msg:res.user})
    }
    else{
        console.log("You donyt have any set user logs...")
         console.log("user session is ",req.user,"session->",req.session);
         res.status(200).json({status:false,msg:"UIts NOT working"})
    }
})
app.get("/home",(req,res)=>{ 
    // console.log("USER session ",req.session);
    // console.log("USER details ",req.user);
    // console.log("USER cookie ",req.headers.cookie);
    (req.isAuthenticated()) ?  res.status(200).json({status:true,msg:"working",userDetails:req.user}) :  res.status(401).json({status:false,msg:"not authorized"})
        
})
app.get("/results",async (req,res)=>{
    const {table,roll_number} = req.query;
    console.log("Table to search ",table,roll_number)
    if(roll_number && table){
         let results = await getStudentResults(table,roll_number)
         res.status(200).send(results)
    }
    else{
        console.log("Something wrong with the search params...",table,roll_number)
        res.status(400).send("Error")
    }
   
    
})
app.get("/results/semester/subjects",async (req,res)=>{
    const {table} = req.query;
    // console.log("Table to search ",table)
    let results = await getStudentSemesterSubjects(table)
    res.status(200).send({results,user:req.user})
})
app.get("/result/subject/failed",async(req,res)=>{
    const {subject,view} = req.query;
    if(subject && view) {
        const result= await getFailedFromSubject(view,subject)
        res.status(200).json({data:result})
    }
    else{
        console.log("Something wrong with the search params...")
    }
})
app.get("/result/subject/passed",async(req,res)=>{
    const {subject,view} = req.query;
    if(subject && view){
        const result= await getPassedFromSubject(view,subject)
        res.status(200).json({data:result})
    }
    else{
        console.log("Something wrong with the search params...")
    }
})
app.post("/uploads",upload.single("profilePicture"),async (req,res)=>{
    const filePath = req.file.path
    try {
       let result= await addProfilePicture(req.user.roll_number,filePath,"user");
       if(result){
            return res.status(200).json({status:true,msg:"Profile picture uploaded successfully",filePath:filePath})
       }
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({status:false,msg:"Error uploading profile picture",error:error.message});
    }
    console.log("File uploaded successfully:", filePath);
})
app.post("/default-pic",async (req,res)=>{
    let {path} = req.body;
    try {
        if(!path){
        throw new Error("Invalid image path")
        }
        let result= await addProfilePicture(req.user.roll_number,path,"default");
        if(!result){
            throw new Error("Failed Adding Image");
        }
        res.status(200).json({status:true,msg:"Profile Picture Uploaded  Successfully",filePath:path})
    } catch (error) {
        console.log("Error uploading default Profile  Pic",error);
        res.status(200).json(({status:false,error:error}));
    }
})
app.get("/uploads",async (req,res)=>{
    try {
        if(req.user){
        const userId = req.user.roll_number;
        const result = await retrieveProfile(userId);
        res.status(200).json({status:true,path:result[0].profile_picture,type:result[0].profile_picture_type})
    }
    else{
        console.log("Not Signed in wiered")
    }
    } catch (error) {
        console.log(error);
        res.status(500).json({status:false,err:error})
    }
})
app.get("/personal-details",async (req,res)=>{
    try {
        if(req.user){
             let data = await enquireStudentPersonalInfo(req.user.roll_number);
            // console.log("This is the data that is not rebdering",data,req.user.roll_number)
            res.status(200).json({status:true,data:data});
        }
        else{
            // console.log("Sorry but passport did not leave you any cookies  :(");
            res.status(200).json({status:false,data:[]});
        }
       
    } catch (error) {
       console.log("error",error)
       res.status.apply(500).json({status:false});
    }
})
app.get("/personal-details/visitor",async (req,res)=>{
    const {roll_number} = req.query;
    try {
             let data = await enquireStudentPersonalInfo(roll_number);
            // console.log("This is the data that is not rebdering",data,req.user.roll_number)
            res.status(200).json({status:true,data:data});
       
    } catch (error) {
       console.log("error",error)
       res.status.apply(500).json({status:false});
    }
})

app.get("/addCredentials",async (req,res)=>{
    try {
         if(req.user){
            const{field,value} = req.query;
            const result= await addCredentials(field,req.user.roll_number,value);
            if(result){
                res.status(200).json({status:true})
            }
            }
            else{
                throw new  Error("Not Authorised")
            }
    } catch (error) {
        console.log("Error Occured",error)
    }
})

app.get("/myUserName",async (req,res)=>{
    
    try {
        if(req.user){
        let roll_number = req.user.roll_number;
        let result = await getUserName(roll_number);
        // console.log("My Data",result[0],roll_number)
        res.status(200).json({status:true,value:result[0].student_name});
    }
    } catch (error) {
        console.log("Error",error)
    }
})
app.get("/students/all",async (req,res)=>{
    
    try {
        let result = await getAllStudents();
        // console.log(result)
        res.status(200).json({status:true,value:result})
    } catch (error) {
        console.log(error);
        res.status(500).json({status:false})
        }
})
app.get("/student/getfollowers",async (req,res)=>{
    try {
        const {roll_number} = req.query;
        const studentDetails = await getFollowersDetails(roll_number);
        res.status(200).json({status:true,data:studentDetails})
    } catch (error) {
        console.error(error);
        res.status(500).json({status:false});
    }
})
app.get("/my-activated-users",async (req,res)=>{
    
    try {
        const result = await getActivatedStudentsChats();
        res.status(200).json({status:true,data:result});
    } catch (error) {
        console.error(error);
        res.status(500).json({status:false})
    }
})

app.get("/class/timetable",async (req,res)=>{
    try {
        const myData = await getTimetable();
        res.status(200).json({status:true,data:myData})
    } catch (error) {
        console.error(error);
        res.status(501).json({status:false})
    }
})
app.post("/class/mark-subject-attendance",async (req,res)=>{
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
app.get("/class/subject-attendance-check",async (req,res)=>{
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

app.get("/class/get-attendance-list",async (req,res)=>{
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














app.use('/login',(err,req,res,next)=>{
    console.error("Something wrong in the server...",err.message)
    res.status(500).json({status:false,msg:err})
})

const httpServer= app.listen(process.env.PORT,()=>{
    console.log("Server is up...",process.env.PORT);
})

const corsOptionsSocket = {
  origin: function (origin, callback) {
    const allowedBase = [
      'https://rollcall.vercel.app',
      "rollcall-77s5-2kcst8dea-thomas-kazondas-projects.vercel.app",
      'http://localhost:3000'
    ];

    // Allow anything ending with .vercel.app (preview deploys)
    const isVercelPreview = origin?.endsWith('.vercel.app');

    if (!origin || allowedBase.includes(origin) || isVercelPreview) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  credentials: true
};

const io= new Server (httpServer,{
    cors:corsOptionsSocket,
});

mySocketLogic(io)





export {session,httpServer}