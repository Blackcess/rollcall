import { NavLink, Outlet, useNavigate } from "react-router-dom"
import "./Admin.css"
export function Admin(){
    let navigation = useNavigate()

    return <>
        <section className="admin-temp-sct">
            <div className="admin-head-txt">
                <NavLink to={`enrollment`}>Enrollments</NavLink>
                <NavLink to={`timetable/${1}/${5}`}>Timetable</NavLink>
                <NavLink to={`attendance`}>Attendance</NavLink>
                <NavLink to={`lecture/workspace/${1}/${5}/${1}`}>Lectures</NavLink>
            </div>
            <div className="admin-out">
                <Outlet/>
            </div>
            
        </section>
        
    </>
}