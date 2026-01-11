import { useNavigate } from "react-router-dom";
import "./Logout.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Aunthentication/AuthProvider";

const API_BASE_URL = process.env.REACT_APP_API_URL;

function Logout(){
    let [proceed,setProceed] = useState(false);
    let sessionData= useAuth();
    let navigate = useNavigate();
    
    const getProccedStatus= (status)=>{
        setProceed(status);
    }

    useEffect(()=>{
        if(proceed){
            async function logoutUser(){
                
                try {
                    const logoutResult=  await axios.get(`${API_BASE_URL}/logout`,{
                            withCredentials:true
                        })
                        sessionData.refresh()
                        // console.log("Logout Result: ",logoutResult);
                        navigate("/login")
                } catch (error) {
                    console.log("Error logging out: ",error);
                }
            }
            logoutUser();
        }
    },[proceed])
    return<>
    <section className="logout-section-template">
        {/* <h2>Logout</h2> */}
        <div className="confirm-log-out">
            <ConfirmLogOut value={{feedBack:getProccedStatus}}/>
        </div>
    </section>
    </>
}

function ConfirmLogOut(props){
    let navigation = useNavigate()
    return<>
        <section className="confirm-log-out-section">
            <h3>Confirm Logout</h3>
            <div className="confirm-log-out-statement"> 
                <p>You are about to Logout of your <span className="brand-lengend">RollCall</span> Account</p>
                <p>Are you sure you want to log out?</p>
            </div>
            <div className="confirm-logout-buttons">
                <button className="confirm-logout-button" id="c-l-b-yes" onClick={()=>{
                    props.value.feedBack(true);
                }}>Yes</button>
                <button className="confirm-logout-button" id="c-l-b-no" onClick={()=>{
                    navigation("/protected/layout/class")
                }}>No</button>
            </div>
        </section>
    </>
}
export default Logout;
