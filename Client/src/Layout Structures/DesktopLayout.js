import "./DesktopLayout.css"
import DesktopSideBar from "../components/sidebar/Desktop/DesktopSidebar"
import { Outlet } from "react-router-dom"
import DesktopNav from "./DesktopNav/DesktopNav";
import { useScreenData } from "../components/Layout/Layout";
import { useEffect, useState } from "react";

function DesktopLayout(){
  
    const [sidebarCollapsed,setDesktopCollapsed] = useState(false)
    let windowWidth = window.innerWidth;
    let [profPicType,setProfPicType] =useState("");

    
    
    return <>
    <section className="desktop-template">
    <div className="desktop-header">
        <DesktopNav/>
    </div>
    <div className={"desktop-lower-part-big-screen"}>
        <div className={ `desktop-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
            <DesktopSideBar collapseHandler ={(state)=>setDesktopCollapsed(state)} collapsed={sidebarCollapsed}/>
        </div>
        <div className="desktop-outlet">
            <Outlet/>
        </div>
       
    </div>

    </section>
    </>
}

export default DesktopLayout