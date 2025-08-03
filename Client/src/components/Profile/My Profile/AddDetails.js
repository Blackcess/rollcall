import { useEffect, useState } from "react";
import "./AddDetails.css"
import { useLocation,NavLink,useParams, useNavigate } from "react-router-dom";
import { IoIosSend } from "react-icons/io";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL;
function AddDetails(){
    const {field} = useParams()
    const [inputValue,setInputValue] = useState("");
    const [submitStatus,setSubmitStatus] = useState(false);
    const [door,setDoor]=useState(false);
    const [updateDone,setUpdateDone]= useState(false);
    let navigate = useNavigate();
    useEffect(()=>{
        if(submitStatus){
            setTimeout(()=>{ 
                setDoor(true);
            },2000);
            async function addDetails(){
                let temp  = {};
                temp.field=field;
                temp.value=inputValue;
                try {
                      const result= await axios.get(`${API_BASE_URL}/addCredentials?field=${field}&value=${inputValue}`,{
                        withCredentials:true
                            })
                            if(result.data.status){
                                setUpdateDone(true)
                            }
                            else{
                                setUpdateDone(false)
                            }
                } catch (error) {
                    console.log("Error",error)
                    setUpdateDone(false)
                }
            }
            addDetails()
        }
    },[submitStatus])
    useEffect(()=>{
        if(door){
            setSubmitStatus(false)
        }
    },[door])
    useEffect(()=>{ 
        if(updateDone){
            setTimeout(()=>{
                navigate("/protected/layout/profile/myProfile")
            },3000)
        }
})
function selectType (field){
    let value = "text"
    switch (field) {
        case "phone_number":
             value="phone"
            break;
        case "email_address":
             value="email"
            break;
        case "date_of_birth":
             value="date"
            break;
        default:
            value="text"
            break;
    }
    return value;
}
    return <>
        <section className="add-details-section">
            <h3>Update {field}</h3>
           {(!updateDone) ? <form className="form-field-cont">
                <input type={selectType(field)} value={inputValue} onChange={(e)=>{
                    setInputValue(e.target.value)
                }} placeholder={(field=="date_of_birth")?`YYYY-MM-DD`:`Enter ${field}`} className="field-data"/>
                <button className="send-field" onClick={(e)=>{
                    e.preventDefault();
                    setSubmitStatus(true)
                    setDoor(false)
                }}><span className="send-ic"> < IoIosSend /></span>Send</button>
            </form>
            :
            <div className="update-done-add">
                Update Done
            </div>
}
        </section>
    </>
}
export default AddDetails;