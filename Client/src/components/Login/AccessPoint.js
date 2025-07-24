import axios from "axios";
import { useState,useEffect } from "react";
import "./AccessPoint.css"
import { useNavigate } from "react-router-dom";
import LoginFailure from "./LoginFailure";
import { useAuth } from "../../Aunthentication/AuthProvider";


function Login() {

    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const[submitStatus,setSubmitStatus]=useState(false)
    const [loginFailed,setLoginFailed] = useState(false)
    const [failureLogic,setFailureLogic]=useState(false)
    const [isLoggedin,setIsLoggedin]=useState(false)
    
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
      console.log("Temp: ",temp)
         const resultFromBackend= async ()=>{
          try{
                let res = await axios.post("https://rollcall-iakp.onrender.com/login",{
                  username:temp.username,
                  password:temp.password
                },{
                  withCredentials:true
                })
                console.log(res.data)
                if(res.data.status){
                  refresh()
                  navigate("/protected/layout/home",{
                  replace:true
                })
                }
                else{
                  setLoginFailed(true)
                }
             }
          catch(err){
              console.log("Login Error... ",err)
              setLoginFailed(true)
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
                setFailureLogic(false)
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
        <LoginFailure value={{feedback:getDataFromFailure}}/>
      </div>
      }
    </section>
  
  
  </>
}

export default Login;