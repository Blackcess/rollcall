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
const API_BASE_URL = process.env.REACT_APP_API_URL;


//complete algorithm outline
// 1. Get All Lectures for the specific date

function MyAttendance (){
    const [timetable,setTimetable] = useState([]) 
    const [attendanceList,setAttendanceList] = useState([]);
    const [attendanceListLoaded,setAttendanceListLoaded] = useState(false);
    const [timetableLoaded,setTimetableLoaded] = useState(false);
    const [allLecturesRecorded,setAllLecturesRecorded] = useState(false);
    const [recorded,setRecorded] = useState([]);
    const [refresh,setRefresh]= useState(false);
    const [initialiser,setInitialiser] = useState(0)
    const [lectureBin,setLectureBin] = useState([])
    const [unSpecifiedLectures,setUnSpecifiedLectures] = useState([])
    const [notifyUnspecified,setNotifyUnspecified] = useState(false)
    const [isSubmitting,setIsSubmitting]= useState(false)
    const [noClass,setNoClass] = useState(false)
    const btnRef = useRef(null)
    const sessionData = useAuth()

    // const [not_recorded,setNot_Recorded] = useState([]);
    const myDate = new Date();
    const today = myDate.toLocaleDateString("en-EN",{weekday:"long"});
    
    useEffect(()=>{
        // getTimetable();
        async function loadData(){
            try {
                const {data} = await getTimetable(5,1)
                setTimetable(()=>{return data});
                setTimetableLoaded(true)
            } catch (error) {
                console.error(error)
                setTimetableLoaded(false)
            }
        }
        loadData()
    },[])

    useEffect(()=>{
        if(timetableLoaded){
            const todaySchedule_init = timetable.filter((row)=>row.day_of_week===today);
            const todaySchedule = todaySchedule_init.filter((row)=> row.subject_name)
            if(todaySchedule.length){
                setAttendanceList(()=>{return todaySchedule});
                setAttendanceListLoaded(true);
                setNoClass(false)
            }
            else{
                console.log("No classes today");
                setNoClass(true)
                setAttendanceListLoaded(true)
            }
        }
       
    },[timetableLoaded])

    const updateAttendanceList = (index,status)=>{
        setAttendanceList((prevList)=>{
            const updatedList = [...prevList];
            updatedList[index].attended = status;
            return updatedList
        });
    }

    const handleRecordAttendance = async (lectures) => {
        const attendanceConvertor = (attendance) => (attendance ? 1 : 0);

        for (const row of lectures) {
            try {
                const {status,msg} = await recordAttendance({ 
                    today,
                    subject: row.subject_name,
                    attendance: attendanceConvertor(row.attended),
                    start_time: row.start_time,
                    student_id:sessionData.userData.student_id,
                    semester:sessionData.userData.semester,
                    class_id:sessionData.userData.class_id,
                }
                )
                if(!status){
                    throw new Error(msg)
                }

            } 
        catch (error) {
            console.error("Error marking attendance for: ", row.subject_name, error);
            toast.error(error.response.data.msg, {
                                    theme: "colored"
                                });
            throw error
        }
  }
};
    
    const handleBin= (index,state)=>{
        if(state){
            // lectureBin.push(attendanceList[index])
            setLectureBin((prev)=>{
                let temp= [...prev];
                temp.push(attendanceList[index])
                return temp;
            })
        }
        else{
            // lectureBin.splice(index,1)
            delete attendanceList[index].attended
            setLectureBin((prev)=>{
                let temp= [...prev];
                for(let i=0;i<temp.length;i++){
                    if(temp[i].subject_name===attendanceList[index].subject_name && temp[i].start_time===attendanceList[index].start_time){
                        temp.splice(i,1)
                    }
                }
                return temp;
            })
            // unspecifiedLectureFilter()
        }
    }

    const handleBinWithCleanUp= (subject_name,start_time,status)=>{
        const searchResult = lectureBin.find((row)=>row.subject_name===subject_name && row.start_time===start_time)
        if(searchResult){
            if(searchResult.attended===status){
                // console.log("Status remained thesame. Way to save those CPU cycles")
                return
            }
            else{
                 for(let i=0;i<lectureBin.length;i++){
                    if(lectureBin[i].subject_name===subject_name && lectureBin[i].start_time===start_time){
                        lectureBin[i].attended=status
                    }
                }
            }
        }
        else{
            console.log("No Such Entry Is Found In The Lecture Bin. So Wierd",subject_name,start_time,status)
        }
    }

    //Function to remove unspecified lectures
    const unspecifiedLectureFilter = (array) => {
        const filtered = [];
        const stillUnspecified = [];

        array.forEach((row) => {
            if (!row.hasOwnProperty("attended")) {
                stillUnspecified.push(row);
            }
            else {
                filtered.push(row);
            }
        });

        setUnSpecifiedLectures(stillUnspecified); // only for UI notifications

        return filtered; // <-- IMPORTANT
    };

    const filterAlreadyRecordedLectures = async()=>{
        try {
            const {data} = await checkubjectAttendance(
                sessionData.userData.student_id,
                sessionData.userData.class_id
            )
            const filtrate=lectureBin.filter((row)=>!data.find((el)=>el.start_time===row.start_time))
            return filtrate
        } catch (error) {
            console.error(error)
        }
    }
    const closeNotification= ()=>{
        setNotifyUnspecified(false)
    }
    useEffect(()=>{
        if(isSubmitting){
            btnRef.current.style.backgroundColor="gray"
        }
        else{
            if(btnRef.current){
                 btnRef.current.style.backgroundColor="#4CAF50"
            }
        }
    },[isSubmitting])
    return <>
        <section className="my-attendance-template">
            {(attendanceListLoaded) ?
                (!allLecturesRecorded) ? <div className="outer-list-attendance">
                    <div className="attendance-list-template">
                        Lectures selected is {lectureBin.length}/{attendanceList.length}
                        {
                            attendanceList.map((row,index)=>{
                                return <AttendanceCriteria key={index} value={{row,index,feedback:updateAttendanceList,plugins:{handleBin,handleBinWithCleanUp},refresh}}/>
                            })
                        }
                    </div>  
                    <button ref={btnRef} className="mark-attendance-btn" onClick={async()=>{
                        try {
                            setIsSubmitting(true);
                            const filtrate = await filterAlreadyRecordedLectures();
                            const specifiedLectures = unspecifiedLectureFilter(filtrate);
                            // console.log("Specified Lectures are: ",specifiedLectures)
                            if(!lectureBin.length){
                                toast.info("No lectures selected to mark.", { theme: "colored" });
                            }
                            if(!specifiedLectures.length){
                                // alert(`You have to select and specify attendance before submitting`)
                                toast.warn("You have to select and specify attendance before submitting", {
                                    theme: "colored"
                                });
                                 return
                            }
                            if (specifiedLectures.length!==filtrate.length) {
                                setNotifyUnspecified(true)
                                return;
                            }
                            setNotifyUnspecified(false)

                            await handleRecordAttendance(specifiedLectures);
                            toast.success("Attendance recorded successfully!", {
                                theme: "colored"
                            });
                        } catch (error) {
                            console.error(error);
                            toast.error(error, { theme: "colored" });
                        } finally {
                            setIsSubmitting(false);
                            setRefresh(!refresh)
                        }
                    }}>Mark Attendance</button>
                </div>
                :
                <div className="all-recorded-template">
                    <AllLecturesRecordedComponent>
                        <h3 className="all-recorded-text">All Lectures Recorded</h3>
                    </AllLecturesRecordedComponent>
                </div>
                :
                <ShimmerLoader/>
    
            }
            {
                (notifyUnspecified)
                &&
                <div className="user-notification-specify">
                    <NotifyUserOnSpecification  value={{lectureBin,filterAlreadyRecordedLectures,unspecifiedLectureFilter,closeNotification}}/>
                </div>
            }
        </section>
    </>
}


function AttendanceCriteria({value}){
    const [isChecked,setIsChecked] = useState(false);
    const [marked,setMarked] = useState(false);
    const [option,setOption] = useState(0)
    const sessionData = useAuth()
    useEffect(()=>{
        // value.feedback(value.index,isChecked);
        checkCriteriaStatus();
    },[value.refresh])
  
    const checkCriteriaStatus = async ()=>{
        try {
            // const response= await axios.get(`${API_BASE_URL}/Student/class/subject-attendance-check?subject=${value.row.subject_name}&start_time=${value.row.start_time}`,{
            //         withCredentials:true,
            //     })
            const {data} = await checkubjectAttendance(
                sessionData.userData.student_id,
                sessionData.userData.class_id
            )
                
                    if(data){
                        const item = data.find((element)=>element.start_time===value.row.start_time)
                        if(item){
                            setIsChecked(false)
                            setMarked(true)
                        }
                        else{
                            setMarked(false)
                        }
                    }
        } catch (error) {
            console.error("Error checking criteria status: ", error);
        }
    }
    let presentBtn= useRef(null)
    let absentBtn = useRef(null)
    useEffect(()=>{
        if(option===1){
            if(presentBtn.current && absentBtn.current){
                presentBtn.current.style.backgroundColor=`rgba(141, 143, 141, 1)`
                absentBtn.current.style.backgroundColor=`crimson`
            }
            
        }
        else{
            if(option===2){
                if(presentBtn.current && absentBtn.current){
                    presentBtn.current.style.backgroundColor=`rgb(4, 190, 4)`
                    absentBtn.current.style.backgroundColor=`rgba(141, 143, 141, 1)`
                }
                
            }
        }
        // if(option===0){
        //     presentBtn.current.style.backgrounColor=`rgb(4, 190, 4)`
        //     // absentBtn.current.style.backgrounColor=`crimson`
        // }
    },[option])
    useEffect(()=>{
        // console.log("Is checked has been changed")
        if(isChecked){
            value.plugins.handleBin(value.index,true)
        }
        else{
            value.plugins.handleBin(value.index,false)
        }
    },[isChecked])
    

    return <>
    <section className={`attendance-criteria-template ${marked ? "marked" : ""}`} >
        <div className="primary-display-attendance" onClick={(e)=>{
        
        if(marked){
            toast.info(`Attendance already recorded for ${value.row.subject_name} .`, { theme: "colored" });
        }
        else{
            setIsChecked(!isChecked)
        }
    }}>
             <div className="attendance-input">
                <input type="checkbox" checked={isChecked} onChange={(e)=>{
                    setIsChecked(e.target.checked)
                    }} 
                    disabled={marked}
                    className="my-attendance-checkbox"/>
                {value.row.subject_name}
            </div>
            <div className="attendance-crit-time">
                {value.row.start_time} 
            </div>
        </div>
        {(isChecked) && <div className="secondary-display-attendance">
            <div className="sec-dis-att-1">Mark attendance for this lecture.</div>
            <div className="sec-dis-att-1">
                <button ref={presentBtn} className="final-mark-att" onClick={(e)=>{
                    value.feedback(value.index,true)
                    setOption(1)
                    value.plugins.handleBinWithCleanUp(value.row.subject_name,value.row.start_time,true)
                }} >Present</button>
                <button ref={absentBtn} className="final-mark-att-1" onClick={(e)=>{
                    value.feedback(value.index,false)
                    setOption(2)
                    value.plugins.handleBinWithCleanUp(value.row.subject_name,value.row.start_time,false)
                }} >Abscent</button>
            </div>
        </div>}
    </section>
    </>
}   

const AllLecturesRecordedComponent = styled.div`
    
    width:250px;
    height:400px;
    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: center;
    background:url("https://elements-resized.envatousercontent.com/elements-cover-images/ffb519e5-c291-482f-9e9f-ecfbfc47e671?w=710&cf_fit=scale-down&q=85&format=auto&s=32c9fd0f378d8d583a100a503d498f13e1f5dce9f6917fcd8c3f12fdd3971fca");
    background-size: cover;
    background-position: center;
    border-radius:10px;
    box-shadow: 0 4px 8px rgba(167, 163, 163, 0.1);
    padding:20px;
`
function NotifyUserOnSpecification(props){
    const [toRender,setToRender]=useState([])
    useEffect(()=>{
        resolveError()
    },[])
    const resolveError = async()=>{
        const filtered = await props.value.filterAlreadyRecordedLectures()
        const specified= props.value.unspecifiedLectureFilter(filtered)
        const unspecified = filtered.filter((row)=>!specified.find((el)=>el.start_time===row.start_time))
        // console.log("Show This Here: ",unspecified)
        setToRender(()=>{return unspecified})
    }
    return<>
     <div className="close-icon"><IoMdClose onClick={(e)=>{
            props.value.closeNotification()
        }}/>
    </div>
    <h4>Please Select Present or Absent for the following selected lectures: </h4>
    <div className="left-over-lectures">
                {
                    toRender.map((row,index)=>{
                        return  <div className="pri-lec-temp" key={index*54}>
                                    <span>{row.subject_name}</span>
                                </div>
                    })
                }
    </div>
    </>
}



export default MyAttendance