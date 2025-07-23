import { FaHome } from "react-icons/fa";
import { FcAbout } from "react-icons/fc";
import { AiOutlineLogout } from "react-icons/ai";
import { AiOutlineProduct } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { NavLink } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import "./DesktopSidebar.css"

function DesktopSideBar(){
    let pages = ["Home","About","Class","Profile","Dashboard",'Logout']
    let links = ["home","about","class","profile",`dashboard/desktop/charts/${2}`,'logout']
    let icons = [<FaHome/>, <FcAbout/>,<AiOutlineProduct />,<CgProfile />,<RxDashboard/>,<AiOutlineLogout/>]
    return <>
    
    <section className="desktop-sidebar-helper-template">
        <ul className="main-sidebar">
            {
                pages.map((page,index)=>(
                    <NavLink className="sidebar-page-1" key={index} to={links[index]}>
                        <span className="s-b-icon">{icons[index]}</span>
                        <span className="s-b-title">{page}</span>
                    </NavLink >
                ))
            }
        </ul>

     
    </section>
    </>
}

export default DesktopSideBar