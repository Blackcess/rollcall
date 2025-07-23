import "./DesktopLayout.css"
import DesktopSideBar from "../components/sidebar/Desktop/DesktopSidebar"
import { Outlet } from "react-router-dom"
import DesktopNav from "./DesktopNav/DesktopNav";
import { useScreenData } from "../components/Layout/Layout";
import { useEffect, useState } from "react";

function DesktopLayout(){
    let bigScreenClass= "desktop-lower-part-big-screen"
    let smallScreenClass= "desktop-lower-part-small-screen"
    let [bigScreen,setBigScreen]= useState(false);
    let [classDecider,setClassDecider]= useState(smallScreenClass);
    let windowWidth = window.innerWidth;
    let [profPicType,setProfPicType] =useState("");
    useEffect(()=>{
        function handleResize(){
            if(window.innerWidth>1440){
                setClassDecider(bigScreenClass)
                setBigScreen(true)
            }
            else{
                setClassDecider(smallScreenClass)
                setBigScreen(false)
            }
        }
        window.addEventListener("resize",handleResize)
    },[windowWidth])

    
    
    return <>
    <section className="desktop-template">
    <div className="desktop-header">
        <DesktopNav/>
    </div>
    <div className={classDecider}>
        <div className="desktop-sidebar">
            <DesktopSideBar/>
        </div>
        <div className="desktop-outlet">
            <Outlet/>
        </div>
       {(bigScreen) &&  <div className="ad-section">

        </div>
       }
    </div>

    </section>
    </>
}

export default DesktopLayout