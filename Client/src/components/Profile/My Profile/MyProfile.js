import "./MyProfile.css"
import axios from "axios";
import { MdEdit } from "react-icons/md";
import { useEffect,useState } from "react";
import { NavLink } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL;

function MyProfile(){
    let [noDataEntered,setNodataEntered]= useState(true);
    let [userCredentials,setCredentials]= useState({
        email_address:"unknown",
        phone_number:"unknown",
        semester:"5",
        admission_year:"2023",
        department:"B.TECH CSE",
        gender:"unknown",
        date_of_birth:"unknown"
    })
    let [dataLoaded,setDataLoaded]= useState(false);
    useEffect(()=>{
        async function student_credentials(){
            
            try {
                const result = await axios.get(`${API_BASE_URL}/personal-details`,{
                withCredentials:true
            })
            if (result.data.data.value === null){
                setNodataEntered(true);
                setDataLoaded(false)
            }
            else{
                setNodataEntered(false)
                let [temp] = result.data.data.value;
                Object.keys(temp).map((key,index)=>{ 
                     if(temp[key]!==null){
                         return setCredentials((prev)=>{
                            let data = {...prev};
                            data[key] = temp[key]
                            return data;
                        })
                       
                    }
                    setDataLoaded(true);
                
            })
            }
            } catch (error) {
                console.log("Fuck It",error);
            }
        }
        student_credentials();
    },[])
    return<>
        <section className="my-prof-section">
            <h3>My Profile</h3>
            {(noDataEntered)&&
                <div className="enter-crucial-data-template">
                    <h4>Notification</h4>
                    <div className="notification-body-crucial-data"><span>RollCall</span> has not received your information yet<br/>Your Friends will not see your infomation.Please enter the information</div>
                </div>
            }
            {(dataLoaded)&&<div className="your-details-section">
              {
                Object.keys(userCredentials).map((key,index)=>( 
                  <YourDetails key={index} value={{title:key,value:userCredentials[key]}}/>
                ))
              }
            </div>}



        </section>
    </>
}


function YourDetails(props){
useEffect(()=>{
    if(props.value.title==="date_of_birth"){
        console.log("DOB value is ",props.value.value);
    }
})
    return <>
    <section className="my-details-template">
        <h4>{props.value.title}</h4>
        <div className="my-name-section">
            {(props.value.title==="date_of_birth")?<span>{props.value.value.split("T")[0]} </span>:<span>{props.value.value} </span>}
            <NavLink to={`/protected/layout/profile/addDetails/${props.value.title}`}><MdEdit /></NavLink>
        </div>
    </section>
    </>
}
export default MyProfile;