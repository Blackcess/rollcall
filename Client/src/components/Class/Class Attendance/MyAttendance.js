import "./MyAttendance.css"
import axios from "axios"
import { startTransition, use, useEffect, useInsertionEffect, useRef, useState } from "react";
import styled from "styled-components";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { GoDotFill } from "react-icons/go";
import NoClass from "../../Util Components/No Class Disclaimer/NoClass";
import ShimmerLoader from "../../Util Components/ShimmerLoader/ShimmerLoader";
import { getTimetable,recordAttendance,checkubjectAttendance } from "./API/attendanceAPI";
import { useAuth } from "../../../Aunthentication/AuthProvider";
import { getTodayStudentSessions } from "../student lecture sessions/API/lectureViewAPI";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = process.env.REACT_APP_API_URL;



function MyAttendance (){
    const [timetable,setTimetable] = useState([]) 
    const [attendanceList,setAttendanceList] = useState([]);
    const [attendanceListLoaded,setAttendanceListLoaded] = useState(false);
    const [timetableLoaded,setTimetableLoaded] = useState(false);
    const sessionData = useAuth()

    // const [not_recorded,setNot_Recorded] = useState([]);
    const myDate = new Date();
    const today = myDate.toLocaleDateString("en-EN",{weekday:"long"});
    
    useEffect(()=>{
        // getTimetable();
        async function loadData(){
            try {
                // const {data} = await getTimetable(5,1)
               
                const data = await getTodayStudentSessions(sessionData.userData.class_id,myDate.toISOString().slice(0, 10))
                 setAttendanceList(data)
                setTimetableLoaded(true)
                setAttendanceListLoaded(true)
            } catch (error) {
                console.error(error)
                setTimetableLoaded(false)
            }
        }
        loadData()
    },[])
   
    return <>
        <section className="my-attendance-template">
            {(attendanceListLoaded) ?
                <div className="outer-list-attendance">
                    <div className="attendance-list-template">
                        {
                            attendanceList.map((row,index)=>{
                                return <AttendanceCriteria key={index} value={{row}}/>
                            })
                        }
                    </div>  
                </div>
                :
                <ShimmerLoader/>
            }
        </section>
    </>
}


function AttendanceCriteria({value}){
    const [marked,setMarked] = useState(false);
    const [session,setSession] = useState(null)
    const sessionData = useAuth()
    const navigate = useNavigate()
    useEffect(()=>{
        
        async function loadData(){
            await checkCriteriaStatus();

        }
    },[value.refresh])
  
    const checkCriteriaStatus = async ()=>{
        try {
            if(value.status=="ACTIVE"){
                setMarked(true)
            }
            else{
                setMarked(false)
            }
        } catch (error) {
            console.error("Error checking criteria status: ", error);
        }
    }

    return <>
    <section className={`attendance-criteria-template ${marked ? "marked" : ""}`} onClick={
        ()=>{
            navigate(`/protected/layout/class/class-lecture-details/${value.row.id}`,
                {
                    state:{
                        slotId : value.slot_id
                    }
                }
            )
        }
    } >
        <div className="primary-display-attendance">
            <div className="attendance-input">
                {value.row.subject_name}
            </div>
            <div className="attendance-crit-time">
                {value.row.start_time} 
            </div>
        </div>
    </section>
    </>
}   

// to do list
// 1. add push notification when session gets active and closes
// 2. Add real-time updates on comments (socket.io connections)
//3. finish up on the styling





export default MyAttendance