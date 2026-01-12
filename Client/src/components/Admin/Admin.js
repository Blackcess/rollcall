import { NavLink, Outlet, useNavigate } from "react-router-dom"
import "./Admin.css"
import { useAuth } from "../../Aunthentication/AuthProvider"
export function Admin(){
    let navigation = useNavigate()
    const sessionData = useAuth()
    const {class_id,semester,student_id,roll_number} = sessionData.userData

    return <>
        <section className="admin-temp-sct">
            <div className="admin-head-txt">
                <NavLink to={`enrollment`}>Enrollments</NavLink>
                <NavLink to={`timetable/${class_id}/${semester}`}>Timetable</NavLink>
                <NavLink to={`attendance`}>Attendance</NavLink>
                {/* <NavLink to={`lecture/workspace/${class_id}/${semester}/${}`}>Lectures</NavLink> */}
            </div>
            <div className="admin-out">
                <Outlet/>
            </div>
            
        </section>
        
    </>
}