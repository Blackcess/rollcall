import { FaHome } from "react-icons/fa";
import { FcAbout } from "react-icons/fc";
import { AiOutlineLogout } from "react-icons/ai";
import { AiOutlineProduct } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { NavLink } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { SiStudyverse } from "react-icons/si";
import "./DesktopSidebar.css"
import { useState,useEffect } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

// ${collapsed ? "collapsed" : ""} ${sidebarOpen ? "open" : ""}

function DesktopSideBar({collapseHandler, collapsed}){
     const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar
    let pages = ["Home","About","Class","Profile","Dashboard",'Logout',"content","Admin"]
    let links = ["home","about","class","profile",`dashboard/desktop/charts/${2}`,'logout',"study-material","admin"]
    let icons = [<FaHome/>, <FcAbout/>,<AiOutlineProduct />,<CgProfile />,<RxDashboard/>,<AiOutlineLogout/>,<SiStudyverse/>,<MdOutlineAdminPanelSettings/>]
    return <>
    
    <section className={ `desktop-sidebar-helper-template ${collapsed ? "dd-collapsed" : ""}`}>
        <ul className="main-sidebar">
            {
                pages.map((page,index)=>(
                    <NavLink className="sidebar-page-1" key={index} to={links[index]}>
                        <span className={ `s-b-icon ${collapsed ? "bolden-sb" : ""}`}>{icons[index]}</span>
                        {(!collapsed) &&<span className="s-b-title">{page}</span>}
                    </NavLink >
                ))
            }
        </ul>
        <button
          className="collapse-btn"
          onClick={() =>{
            collapseHandler(!collapsed)
          } }
          
        >
           {(collapsed)?<MdOutlineArrowForwardIos/> :  <MdArrowBackIos/>}
        </button>
     
    </section>
    </>
}

export default DesktopSideBar