import "./DesktopNav.css"
import DesktopSearch from "../../components/Search Logic/DesktopSearch";
import { useState,useEffect,useRef } from "react";
import axios from "axios";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdOutlineMessage } from "react-icons/md";
import { useAuth } from "../../Aunthentication/AuthProvider";
import { NavLink } from "react-router-dom";
import SpinLoader from "../../components/Util Components/SpinLoader/SpinLoader";


const API_BASE_URL = process.env.REACT_APP_API_URL;

function DesktopNav(){
    let outerUser = useRef(null)
    let innerUser = useRef(null)
    let [userData,setUserData]=useState({});
    let [userDataLoaded,setUserDataLoaded]=useState(false);
    let [shouldScroll,setShouldScroll]=useState(false);
    let [dropSync,setDropSync] = useState(0)
    let sessionData = useAuth();


    useEffect(()=>{
          try {
        sessionData.refresh()
        } catch (err) {
            console.error("Error refreshing session:", err)
        }
        setDropSync(dropSync+1)
        getUserProfile()
    },[])
    useEffect(()=>{
            if(innerUser.current && outerUser.current){
                const inner = innerUser.current;
                const outer = outerUser.current;
                if(inner.scrollWidth > inner.clientWidth){
                    setShouldScroll(true);
                }
                else{
                    setShouldScroll(false);
                }
            }
        },[sessionData])

        useEffect(()=>{
           
            let profContainer = document.querySelector(".desktop-profile-pic");
                if(sessionData.userData.profPic){
                    profContainer.style.backgroundImage=`url(${imagerResolver()})`
                }
                else{
                    profContainer.style.backgroundImage=`url("data:image/jpeg;base64,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")`
                }
                
                profContainer.style.backgroundPosition="center";
                profContainer.style.backgroundSize="cover";
        
        },[sessionData,dropSync])

        const getUserProfile= async()=>{
            try {
                const res = await axios.get(`${API_BASE_URL}/my-uploads`,{withCredentials:true});
                if(res.data.status){
                    // console.log("ProfPic Loaded: ",res.data)
                    setUserDataLoaded(true);
                    setUserData(res.data);
                }
                else{
                    console.log("Could not fetch user profile pic ")
                }
            } catch (error) {
                console.error("Error in fetching user profile pic ",error)
            }
        }

         function imagerResolver(){
            if(sessionData.userData.profPicType){
                if(sessionData.userData.profPicType.length &&  sessionData.userData.profPicType==="default"){
                     return sessionData.userData.profPic
                }
            else{
                if(sessionData.userData.profPicType==="user"){
                    return `${API_BASE_URL}/${sessionData.userData.profPic.replace(/\\/g, "/")}`
                }else{
                    console.log("profPicType is empty")
                    }
            }
                }
            else{
                console.log("profPicType is not defined")
             }
         }
         useEffect(()=>{
            getUserProfile()
         },[sessionData])
    return <>
    <section className="desktop-nav-section">
        <div className="usefull">
            <div className="desktop-brand">
                <div className="desktop-logo"></div>
                <div className="desktop-name">RollCall</div>
            </div>
            <div className="desktop-search">
                <DesktopSearch/>
            </div>
            <div className="desktop-nav-assesories">
                <div className="desktop-notification"><IoNotificationsOutline/> </div>
                <NavLink className="desktop-messaging" to={"/protected/layout/class/chatSystem"}><MdOutlineMessage/> </NavLink>
                <div className="desktop-user-section-1">
                    <div className="desktop-profile-pic"></div>
                    <div className="desktop-title">
                        <div className="desktop-user-category">Student</div>
                        {(sessionData.loaded) ? <div className="mob-user-name" ref={outerUser}>
                            <div className={ `mob-user-name-inner ${(shouldScroll) ? "scroll" : "" }`}  ref={innerUser}> 
                                {sessionData.userData.student_name}
                            </div>
                        </div>
                        :
                        <SpinLoader/>
                        }
                    </div>
                </div>
            </div>
            
        </div>
      
        
    </section>
    </>
}
export default DesktopNav;