import { NavLink } from "react-router-dom"
import "./Class.css"
function Class(){


    return<>
    <h1>Inside the class component</h1>
    <NavLink to={`/protected/layout/class-timetable`}>
        Timetable
    </NavLink>
    </>
}
export default Class