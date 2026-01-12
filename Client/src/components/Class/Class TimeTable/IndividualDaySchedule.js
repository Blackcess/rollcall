import { useLocation } from "react-router-dom"
import "./IndividualDaySchedule.css"
import { useTimetable } from "./Timetable";
import { useEffect, useState } from "react";
import ShimmerLoader from "../../Util Components/ShimmerLoader/ShimmerLoader";

function DaySchedule(){
    const {search} = useLocation();
    const myparams = new URLSearchParams(search);
    const day = myparams.get("day");
    let {timetable} = useTimetable();
    const [todaySchedule,setTodaySchedule] = useState([]);
    useEffect(()=>{
        if(day.length){
            const temp = timetable.filter((row)=>row.day_of_week==day);
            const sortedTemp = temp.sort((a, b) => {
                                // Compare start times
                                return a.start_time.localeCompare(b.start_time);
            });
            // console.log("My day schedule:  ",sortedTemp);

            setTodaySchedule(()=>{return sortedTemp});
        }
    },[search])
    if(!timetable.length){
        return <p>No Timetable Recoreded For This Class</p>
    }
    return <>
    <section className="day-schedule-template">
        {/* {
            todaySchedule.map((schedule,index)=>{
               return  <ClassActivity value={{schedule}} key={index}/>
            })
        } */}
        {(todaySchedule.length) ? <Timetable_table value={{schedule:todaySchedule}} /> : <ShimmerLoader/>}
    </section>
    </>
}


function ClassActivity(props){
    return <>
        <section className="my-class-activity">
            <div className="activity-time">{props.value.schedule.start_time}</div>
            <div className="activity-name">{props.value.schedule.subject_name}</div>
            <div className="activity-teacher">{props.value.schedule.lecturer}</div>
        </section>
    </>
}

function Timetable_table(props){
    let [currentDate,setCurrentDate]= useState(false)
    let [currentIndex,setCurrentIndex]= useState(-1)
    const today = new Date();
    const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
    useEffect(()=>{
        console.log("Date is ")
        if(props.value.schedule && dayName===props.value.schedule[0].day_of_week){
            setCurrentDate(true)
            setCurrentIndex(getCurrentLectureIndex(props.value.schedule))
            console.log("I should work",getCurrentLectureIndex(props.value.schedule))
        }
        else{
            console.log("No wonder why Im not wiorking")
            setCurrentDate(false)
        }
    },[props])

    function getCurrentLectureIndex(scheduleArray) {
        const now = new Date();
        // Get current time in HH:MM:SS format
         const currentTime = now.toTimeString().slice(0, 8); // "14:22:10"
        // Loop through each schedule entry
        for (let i = 0; i < scheduleArray.length; i++) {
            const lecture = scheduleArray[i];
            // Compare time strings directly because they are in "HH:MM:SS" format
            if (currentTime >= lecture.start_time && currentTime < lecture.end_time) {
                return i;  // Found the current lecture index
            }
        }
        // No match → outside class hours
        return -1;
    }

    return (
    <section className="tt-table-template">
        <table className="tt-table-container">
            <thead className="tt-table-head">
                <tr className="tt-head-column">
                    <th>Time</th>
                    <th>Subject</th>
                    <th>Lecturer</th>
                </tr>
               
            </thead>
            <tbody className="tt-body-template">
                {
                    props.value.schedule.map((schedule,index)=>{
                        return(  
                        <tr className={`tt-body-row ${(currentDate && (index === currentIndex)) ?"my-current-lecture" :"" }`} key={index}>
                            <td>{schedule.start_time}</td>
                            <td>{schedule.subject_name}</td>
                            <td>{schedule.lecturer}</td>
                        </tr>)
                    })
                }
            </tbody>
        </table>
    </section>)
}
export default DaySchedule