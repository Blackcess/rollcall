import axios from "axios";
import { useState,useEffect } from "react";
import "./AccessPoint.css"
import { useNavigate } from "react-router-dom";
import LoginFailure from "./LoginFailure";
import { useAuth } from "../../Aunthentication/AuthProvider";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.REACT_APP_API_URL;

function Login() {

    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const[submitStatus,setSubmitStatus]=useState(false)
    const [loginFailed,setLoginFailed] = useState(false)
    const [failureLogic,setFailureLogic]=useState(false)
    const [isLoggedin,setIsLoggedin]=useState(false)
    let [error,setError]= useState([]);
    
    const {refresh} = useAuth();
    let navigate  = useNavigate();
    let navigate1  = useNavigate();
    let getDataFromFailure= (data)=>{
      setFailureLogic(data)
    }
   

    
    useEffect(()=>{
      if(submitStatus){
       const temp ={};
       temp.username=username.trim();
       temp.password=password.trim();
         const resultFromBackend= async ()=>{
          try{
                let res = await axios.post(`${API_BASE_URL}/login`,{
                  username:temp.username,
                  password:temp.password
                },{
                  withCredentials:true
                })
                if(res.data.status){
                  navigate("/protected/layout/class",{
                  replace:true
                })
                }
                else{
                  setLoginFailed(true)
                }
             }
          catch(err){
              setLoginFailed(true)
              setError((prev)=>{
                return [err.response.data.msg]
              })
              toast.error(`${err.response.data.msg}`, { theme: "colored" });
          }
       
       }
        resultFromBackend()
        setSubmitStatus(false)
      }
    },[submitStatus])

    useEffect(()=>{
      if(failureLogic){
        setLoginFailed(false)
      }
    },[failureLogic])

  return <>
     <section className="login-container">
      {(!loginFailed) ? <div className="form-wrapper">
        
        <form className="login-form">
          <input className="username-field" type="text" placeholder="Enter Roll Number" value={username} onChange={(event)=>{
            setUsername(event.target.value)
          }} recquired/>
          <input className="password-field" type="text" placeholder="Password" value={password} onChange={(event)=>{
            setPassword(event.target.value)
          }} recquired/>
          <button className="login-submit-btn" type="submit" onClick={(event)=>{ 
            event.preventDefault();
            if(username.trim()!=="" || password.trim()!==("")){
                setFailureLogic(false);
                setSubmitStatus(true);
            }
          
            }}>Login</button>
            <button className="login-submit-btn" onClick={(e)=>{
              e.preventDefault();
              navigate1("/create-account",{
                replace:false
              })
            }}>Create Account</button>
        </form>
      </div>
      :
      <div> 
        <LoginFailure value={{feedback:getDataFromFailure}} error={error}/>
      </div>
      }
    </section>
  
  
  </>
}

export default Login;