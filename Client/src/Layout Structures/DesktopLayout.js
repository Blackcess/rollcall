import "./DesktopLayout.css"
import DesktopSideBar from "../components/sidebar/Desktop/DesktopSidebar"
import { Outlet } from "react-router-dom"
import DesktopNav from "./DesktopNav/DesktopNav";
import { useScreenData } from "../components/Layout/Layout";
import { useEffect, useState } from "react";

function DesktopLayout(){
    // let bigScreenClass= "desktop-lower-part-big-screen"
    // let smallScreenClass= "desktop-lower-part-small-screen"
    // let [bigScreen,setBigScreen]= useState(false);
    // let [classDecider,setClassDecider]= useState(smallScreenClass);
    const [sidebarCollapsed,setDesktopCollapsed] = useState(false)
    let windowWidth = window.innerWidth;
    let [profPicType,setProfPicType] =useState("");
    // useEffect(()=>{
    //     function handleResize(){
    //         if(window.innerWidth>1440){
    //             // setClassDecider(bigScreenClass)
    //             setBigScreen(true)
    //         }
    //         else{
    //             // setClassDecider(smallScreenClass)
    //             setBigScreen(false)
    //         }
    //     }
    //     window.addEventListener("resize",handleResize)
    // },[windowWidth])

    
    
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