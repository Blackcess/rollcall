import axios from "axios"
import "./Timetable.css"
import { createContext, useEffect,useState,useContext} from "react";
import { NavLink, Outlet,useLocation, useNavigate } from "react-router-dom";
import ShimmerLoader from "../../Util Components/ShimmerLoader/ShimmerLoader";
import { useAuth } from "../../../Aunthentication/AuthProvider";
const API_BASE_URL = process.env.REACT_APP_API_URL;
const GlobalTimetable= createContext();
function TimeTable(){
    const [timetable,setTimetable] = useState([]) 
    const [timetableLoaded,setTimetableLoaded] = useState(false);
    const location = useLocation();
    const myDate = new Date();
    const navigation = useNavigate();
    const sessionData = useAuth()
    

    useEffect(()=>{
        getTimetable();
        // console.log("The Date Status Is ",myDate.toLocaleDateString("en-EN",{weekday:"long"}));
        if(myDate.toLocaleDateString("en-EN",{weekday:"long"})==="Sunday" || myDate.toLocaleDateString("en-EN",{weekday:"long"})==="Saturday"){
            navigation(`day-schedule-weekend?type=weekend`)
        }
        else{
            navigation(`day-schedule?day=${myDate.toLocaleDateString("en-EN",{weekday:"long"})}`)
        }
    },[])
    async function getTimetable(){
        try {
                const response= await axios.get(`${API_BASE_URL}/Student/class/timetable?classId=${sessionData.userData.class_id}&semester=${sessionData.userData.semester}`,{
                withCredentials:true,
                    }) 
                if(response.data.status){
                    // console.log("My Time table is: ",response.data.data);
                    setTimetable(()=>{return response.data.data});
                    setTimetableLoaded(true)
                }
        } catch (error) {
            console.error(error);
            setTimetableLoaded(false)
        }
    }
    const week_days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
    return <>
    <section className="my-time-table-template">
        {/* <h2>This is my classs Time table</h2> */}
        {
            (timetableLoaded) ?
            <div className="time-table-loaded-temmplate">
                <div className="timetable-days-of-week">
                    {
                        week_days.map((day,index)=>{
                             const isCurrent = location.search === `?day=${day}`;
                            return <NavLink className={({isActive})=>{
                               
                                 if(isCurrent){
                                    return `active-day`
                                 }
                                 else{
                                    return "non-active-day"
                                 }
                            }} key={index} to={`day-schedule?day=${day}`}>{day}</NavLink>
                        })
                    }
                </div>

                <div className="timetable-outlet-template">
                    <GlobalTimetable.Provider value={{timetable}}>
                        <Outlet/>
                    </GlobalTimetable.Provider>
                </div>
            </div>
            :
            <ShimmerLoader/>
        }
    </section>
    </>
}

const useTimetable = ()=>{
    return useContext(GlobalTimetable);
}
export {TimeTable,useTimetable}