import { io } from "socket.io-client";
import { useAuth } from "../../../Aunthentication/AuthProvider";
const SOCKET_BASE_URL = process.env.REACT_APP_SOCKET_URL
// const sessionData= useAuth();

 const connectSocket = (id)=>{
            return io(`${SOCKET_BASE_URL}`,{
                auth:{
                userId:id
                },
                withCredentials:true,
            })
}
export {connectSocket};