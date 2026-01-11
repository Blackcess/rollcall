import { useAuth } from "../../Aunthentication/AuthProvider";
import { Outlet, UNSAFE_NavigationContext, useNavigate } from "react-router-dom";
import { useEffect,useState,useContext,createContext, useRef } from "react";
import { connectSocket } from "./socket connection management/socket";
import axios from "axios";
// import { useAuth } from "../../Aunthentication/AuthProvider";

const API_BASE_URL = process.env.REACT_APP_API_URL;
const SOCKET_BASE_URL = process.env.REACT_APP_SOCKET_URL
const SocketContext = createContext();


function Protected({children}){
    const navigate = useNavigate()
    const {isAuthenticated} = useAuth();
    const [userState,setUserState]=useState({})
    const sessionData= useAuth();
    const socketRef = useRef(null);
    // const connectSocket = ()=>{
    //         return io(`${SOCKET_BASE_URL}`,{
    //             auth:{
    //             userId:sessionData.userData.roll_number
    //             },
    //             withCredentials:true,
    //         })
    // }
    if(!socketRef.current  && sessionData.userData?.roll_number){
        socketRef.current = connectSocket(sessionData.userData.roll_number);
    }
    useEffect(()=>{
            navigate("/protected/layout/class",{replace:true});
            
    },[])
    const socket = connectSocket();
     // Prevent children from rendering before socket is ready
  if (!socketRef.current) {
    return <div>Connecting to server...</div>;
  }
    
    return <>
    <SocketContext.Provider value={{socket: socketRef.current}}>
         <Outlet/>
    </SocketContext.Provider>
       
    </>
}

function useSocket(){
    return useContext(SocketContext)
}
export {Protected,useSocket};