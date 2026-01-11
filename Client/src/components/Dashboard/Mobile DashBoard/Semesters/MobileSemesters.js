import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import "./MobileSemesters.css"
import { MdOutlineNavigateNext } from "react-icons/md";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import axios from "axios";


const API_BASE_URL = process.env.REACT_APP_API_URL;
function MobileSemesters(){
    // const semesters = ["Semester 1", "Semester 2","semester 3"];
    const [semesterSelected,setSemesterSelected]= useState(false);
    const [allSemesters,setAllSemesters]= useState([])
    const [allSemestersFetched,setAllSemestersFetched]= useState(false);
    const getSemSelectedData = (status)=>{
        setSemesterSelected(status)
    }

    useEffect(()=>{
        fetchSemetersList();
    },[])

    async function fetchSemetersList(){
        try {
            const res = await axios.get(`${API_BASE_URL}/Student/results/list-all-recorded-semesters?roll_number=2305333`,{
                withCredentials:true
            })
            if(res.data.status){
                setAllSemesters(res.data.data)
                setAllSemestersFetched(true)
            }
        } catch (error) {
            console.error("Error fetching semesters list: ", error);
        }
    }
    
    return <>
    {(allSemestersFetched) && <section className="mobile-semesters-template">
       { (!semesterSelected) ? <div className="sem-link-container-011" onClick={()=>setSemesterSelected(true)}><span className="sem-name">Semesters</span>  <span className="sem-icon"><MdOutlineKeyboardArrowDown /></span></div>
            :
            <div className="semester-navigation">
             {
            allSemesters.map((sem,index)=>(
                 <div key={index}>
                    <MobileSemesters_helper value={{data:sem,index,feedback:getSemSelectedData}}/>
                </div>
            ))
            }
        </div>
    } 
        <div className="actual-seme-data">
            <Outlet/>
        </div>
    </section>}
    </>
}

function MobileSemesters_helper(props){

    return <>
    <NavLink className={({isActive})=>{
        
        return (isActive) ? "m-sem-helper-template-selected" : "m-sem-helper-template"
    }} to={`/protected/layout/dashboard/mobile/semester/${props.value.index + 1}`}  onClick={()=>props.value.feedback(false)}>
          <div className="sem-temp" id="id-4-sem">{props.value.data}</div>
          {/* <div className="sem-helper-icon"><MdOutlineNavigateNext/></div> */}
    </NavLink>
    </>
}
export default  MobileSemesters