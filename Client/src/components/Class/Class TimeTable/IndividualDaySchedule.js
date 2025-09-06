import { useLocation } from "react-router-dom"
import "./IndividualDaySchedule.css"
import { useTimetable } from "./Timetable";
import { useEffect, useState } from "react";

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
    return <>
    <section className="day-schedule-template">
        {
            todaySchedule.map((schedule,index)=>{
               return  <ClassActivity value={{schedule}}/>
            })
        }
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
export default DaySchedule