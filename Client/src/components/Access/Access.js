import { useAuth} from "../../Aunthentication/AuthProvider"
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";


const API_BASE_URL = process.env.REACT_APP_API_URL;


function Access(){
    const {isAuthenticated,login} = useAuth();
    let navigate  = useNavigate();
    let location = useLocation();
    useEffect(()=>{
       let checkBackend = async ()=>{
            try {
            let res = await axios.get(`${API_BASE_URL}/home`,{
            withCredentials:true
                })
            console.log(res.data);
            if(res.data.status){
                console.log("You are logged in")
                navigate("/protected/layout/class",{
                    replace:true
                })
            }
            else{
                console.log("You are not logged in")
                navigate("/login",{
                    replace:true
                })
            }
      } catch (error) {
            console.log(error)
            navigate("/login",{
                replace:true
            })

            
        }
        }
    checkBackend() 
    })

    return<>
    {/* <h1>Access Point</h1> */}
    <p style={{fontSize:"12px"}}>Configuring Rollcall System (lackLeaf ltd)- Thomas Kazonda... CEO</p>
    </>
}
export default Access;