import { useEffect, useState } from "react"
import axios from "axios"
import MobileDashBoard from "./Mobile DashBoard/MobileDashBoard"
import { useAuth } from "../../Aunthentication/AuthProvider"
import { useScreenData } from "../Layout/Layout"
import { Outlet, useLocation, useNavigate } from "react-router-dom"

function Dashboard(){
    let location = useLocation()
    const globalData= useScreenData();
    let [renderIndex,setRenderIndex]= useState(2)
    let navigation = useNavigate();
    useEffect(()=>{
        if(globalData.mobileScreen){
            navigation(`/protected/layout/dashboard/mobile/semester/${3}`)
        }
        else{
                navigation(`/protected/layout/dashboard/desktop/charts/${3}`)    
        }
    },[])
    
    return <>
    <section className="dashboard-decider-template">
        <Outlet/>
    </section>
    
    </>
}
export default Dashboard