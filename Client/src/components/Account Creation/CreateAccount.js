import "./CreateAccount.css"
import { useEffect, useState } from "react";
import { useNavigate,NavLink} from "react-router-dom";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;


function CreateAccount(){
    let [rollNumber,setRollNumber]= useState(null)
    let [password,setPassword]= useState(null)
    let [confirmPassword,setConfirmPassword]= useState(null)
    let [submitStatus,setSubmitStatus]= useState(false)
    let [error,setError]= useState([]);
    let navigate = useNavigate();

    useEffect(()=>{
        if(submitStatus){
            const temp = {};
            temp.rollNumber = rollNumber.trim();
            temp.password = password.trim();
            temp.confirmPassword = confirmPassword.trim();
            // console.log("Temp: ",temp)
            const resultFromBackend= async ()=>{
                try{
                    let res = await axios.post(`${API_BASE_URL}/create-account`,{
                        roll_number:temp.rollNumber,
                        password:temp.password,
                        confirm_password:temp.confirmPassword
                    },{
                        withCredentials:true
                    })
                    console.log(res.data)
                    if(res.data.status){
                        alert("Account Created Successfully!")
                        navigate("/login",{replace:true});
                    }
                }
                catch(err){
                    console.log("Error creating account: ",err)
                    setError((prev)=>{
                        return [err.response.data.error]
                    })
                }
            }
            resultFromBackend()
            setSubmitStatus(false)
        }
    },[submitStatus])

//     useEffect(()=>{ 
//                 if(error.length > 0){
//             console.log("Errors ",error)
//         }
// },[error])
    return<>

         <section className="login-container">
              <div className="form-wrapper">
                <form className="login-form">
                  <input className="username-field" type="text" placeholder="Enter Roll Number..." value={rollNumber} onChange={(e)=>{
                    setRollNumber(e.target.value)
                  }} recquired/>
                  <input className="password-field" type="password" placeholder="Password" value = {password} onChange={(e)=>{
                    setPassword(e.target.value) 
                  }} recquired/>
                  <input className="password-field" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e)=>{
                    setConfirmPassword(e.target.value)
                  }} recquired/>
                  <button className="login-submit-btn" type="submit" onClick={(e)=>{
                    e.preventDefault();
                    if(rollNumber && password && confirmPassword){
                        if(password === confirmPassword){
                            setSubmitStatus(true);
                        }
                        else{
                            alert("Passwords do not match!")
                            setSubmitStatus(false);
                            setError((prev)=>{
                                return [...prev,"unmatched passwords"]
                            })
                        }
                    }
                  }}>Create</button>
                  <NavLink className="back-to-login" to={"/login"}>Already have an account</NavLink>
                  <div className="error-display">
                    {error.map((err,index)=>{
                        return <p key={index} className="error-text">{err}</p>
                    })}
                  </div>
                  
                </form>
                  
              </div>
              
            </section> 
    </>
}
export default CreateAccount;   