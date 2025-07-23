import { NavLink, Outlet } from "react-router-dom";
import "./MobileSemesters.css"
import { MdOutlineNavigateNext } from "react-icons/md";
function MobileSemesters(){
    const semesters = ["Semester 1", "Semester 2"];
    return <>
    <section className="mobile-semesters-template">
        <div className="semester-navigation">
             {
            semesters.map((sem,index)=>(
                 <div key={index}>
                    <MobileSemesters_helper value={{data:sem,index}}/>
                </div>
            ))
            }
        </div>

        <div className="actual-seme-data">
            <Outlet/>
        </div>
       
        
    </section>
    </>
}

function MobileSemesters_helper(props){

    return <>
    <NavLink className={({isActive})=>{
        return (isActive) ? "m-sem-helper-template-selected" : "m-sem-helper-template"
    }} to={`/protected/layout/dashboard/mobile/semester/${props.value.index + 1}`}>
          <div className="sem-temp" id="id-4-sem">{props.value.data}</div>
          {/* <div className="sem-helper-icon"><MdOutlineNavigateNext/></div> */}
    </NavLink>
    </>
}
export default  MobileSemesters