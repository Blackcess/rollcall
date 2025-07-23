import { useAuth } from "../../Aunthentication/AuthProvider";
import { Outlet, UNSAFE_NavigationContext, useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import axios from "axios";

function Protected({children}){
    const navigate = useNavigate()
    const {isAuthenticated} = useAuth();
    const [userState,setUserState]=useState({})
    // console.log("Is Authenticated status: ", isAuthenticated)

    useEffect(()=>{
            navigate("/protected/layout/home")
    },[])
    return <>
        <Outlet/>
    </>
}
export default Protected;