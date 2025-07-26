import { useAuth } from "../../Aunthentication/AuthProvider";
import { Outlet, UNSAFE_NavigationContext, useNavigate } from "react-router-dom";
import { useEffect,useState,useContext,createContext } from "react";
import {io} from "socket.io-client"
import axios from "axios";
// import { useAuth } from "../../Aunthentication/AuthProvider";

const API_BASE_URL = process.env.REACT_APP_API_URL;
const SocketContext = createContext();


function Protected({children}){
    const navigate = useNavigate()
    const {isAuthenticated} = useAuth();
    const [userState,setUserState]=useState({})
    // console.log("Is Authenticated status: ", isAuthenticated)
    const sessionData= useAuth();
     const connectSocket = ()=>{
            return io(`${API_BASE_URL}`,{
                auth:{
                userId:sessionData.userData.roll_number
                }
            },{
                withCredentials:true
                })
        }

    useEffect(()=>{
            navigate("/protected/layout/home");
            
    },[])
    const socket = connectSocket();
    return <>
    <SocketContext.Provider value={{socket}}>
         <Outlet/>
    </SocketContext.Provider>
       
    </>
}

function useSocket(){
    return useContext(SocketContext)
}
export {Protected,useSocket};