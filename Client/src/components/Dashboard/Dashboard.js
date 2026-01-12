import { useEffect, useState } from "react"
import axios from "axios"
import MobileDashBoard from "./Mobile DashBoard/MobileDashBoard"
// import { useAuth } from "../../Aunthentication/AuthProvider"
import { useScreenData } from "../Layout/Layout"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../Aunthentication/AuthProvider"
import "./Dashboard.css"

const API_BASE_URL = process.env.REACT_APP_API_URL;
function Dashboard(){
    let location = useLocation()
    const globalData= useScreenData();
    const sessionData = useAuth();
    // let [renderIndex,setRenderIndex]= useState(2)
    let navigation = useNavigate();
    useEffect(()=>{
        // console.log("Session Data inside Dashboard: ", sessionData);
        fetchData();
    },[])
    

    async function fetchData(){
        try {
            const res = await axios.get(`${API_BASE_URL}/Student/results/latest-semester?roll_number=${sessionData.userData.roll_number}`,{
                withCredentials:true
            })
            if(res.data.status){
                if(globalData.mobileScreen){
                    navigation(`/protected/layout/dashboard/mobile/semester/${res.data.latest_semester}`)
                }
                else{
                    navigation(`/protected/layout/dashboard/desktop/charts/${res.data.latest_semester}`)    
                }
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }
    return <>
    <section className="dashboard-decider-template">
        <Outlet/>
    </section>
    
    </>
}
export default Dashboard