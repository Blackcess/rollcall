import "./Profile.css"
import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components"
import { MdEdit } from "react-icons/md";
import { useAuth } from "../../Aunthentication/AuthProvider";


import { NavLink, Outlet, useLocation } from "react-router-dom";

function Profile() {
  
   let [renderProf,setRenderProf] = useState(false)
    let [profPic,setProfPic] = useState("");
    let [screenWidth,setScreenWidth] = useState(window.innerWidth);
    let [profPicType,setProfPicType] =useState("");
    let {search} = useLocation();
    let queryParam = new URLSearchParams(search);
    let refresh =  queryParam.get("refresh");
    let [user_name,setUser_name]= useState("");


    let sessionData = useAuth();
    


    // useEffect(()=>{
    //      async function retrivePic(){
         
    //         try {
    //               const result = await axios.get("http://localhost:8000/uploads",{
    //             withCredentials:true
    //         })
    //         if(result.data.status){
    //             console.log("img ", result)
    //             setProfPicType(result.data.type);
    //             setRenderProf(true);
    //             setProfPic(result.data.path)
    //         }
    //         } catch (error) {
    //             console.log("Error in image path",error)
    //         }
    //     }

    //     async function getUser_name(){
          
    //       try {
    //           const result= await axios.get("http://localhost:8000/myUserName",{
    //             withCredentials:true
    //             });
    //             if(result.data.status){
    //               setUser_name(result.data.value)
    //               // console.log("Dont fUCK iT uP",result)
    //             }
    //       } catch (error) {
    //         console.log("Error",error)
    //       }
    //     }
    //     retrivePic();
    //     getUser_name();
    // },[refresh])
   
  
  useEffect(()=>{
    window.addEventListener("resize",()=>{
      setScreenWidth(window.innerWidth)
    })
  })

  function imagerResolver(){
      if(sessionData.userData.profPicType){
        if(sessionData.userData.profPicType.length &&  sessionData.userData.profPicType==="default"){
          return sessionData.userData.profPic;
        }
        else{
          if(sessionData.userData.profPicType==="user"){
            return `http://localhost:8000/${sessionData.userData.profPic.replace(/\\/g, "/")}`
          }else{
            console.log("profPicType is empty")
          }
        }
      }
      else{
        console.log("profPicType is not defined")
      }
  }
  return (
    <section className="profile-section-template">  
       
      <h2 className="profile-heading">Student Profile</h2>
      <div className="profile-pic-setting-section">
        <StyledPic value={{profPic:sessionData.userData.profPic,imagerResolver}}>
          <NavLink className="edit-icon-image" to="edit-profile"><MdEdit/></NavLink>
        </StyledPic>
      </div>
      <div className="profile-lower-part-1">
        <div className="user-data-helper">
          <div className="profile-details-helper">
            <h4>{sessionData.userData.student_name}</h4>
            <div className="user-profile-email">{(sessionData.userData.credentials)? sessionData.userData.credentials.email_address :  "-"}</div>
          </div>
          <div className="student-followers-section">
            <div className="student-followers">0</div>
            <div className="student-followers-title">Followers</div>
          </div>
          <div className="student-followers-section">
            <div className="student-followers">0</div>
            <div className="student-followers-title">Following</div>
          </div>
        </div>
      </div>

      <div className="outlet-decider">
        <div style={{width:"100%"}}>
           <Outlet/>
        </div>
       
        {(screenWidth>800) &&<div className="put-something">
           <p>Put Somthing here</p>
        </div>}
      </div>


    </section>

     
    
  );
}

  let StyledPic = styled.div`
    position:absolute;
    height: 100px;
    width: 100px;
    border-radius: 50%;
    border: 3px solid white;
    top: 70%;
    left: 30px;
    background-image:url(${(props)=>{return (props.value.profPic)?`${props.value.imagerResolver()}`:"data:image/jpeg;base64,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"}});
    background-position:center;
    background-size:cover;
    position:relative;
    cursor:pointer;

    }
    `

export default Profile;