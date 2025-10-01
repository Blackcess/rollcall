import { useEffect, useState } from "react";
import { useAuth } from "../../../../../Aunthentication/AuthProvider"
import "./ComparisonAnalytics.css" 
import styled from "styled-components";
import { Outlet, useLocation, useNavigate,NavLink } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL;

function ComparisonAnalytics(){
    let sessionData  = useAuth();
    let {search} = useLocation();
    let queryParams = new URLSearchParams(search);
    let comp_roll_number = queryParams.get("roll_number")
    let picType= queryParams.get("type")
    let compPic= queryParams.get("pic")
    let [competitorData,setCompetitorData]= useState({profPicType:picType,profPic:compPic})
    let navigate = useNavigate();

    useEffect(()=>{
        sessionData.myResults();
        //I need to get Compatitor data
        navigate(`sgpa-compare?roll_number=${comp_roll_number}&pic=${compPic}&type=${picType}`);
    },[])

    

    function imagerResolver(row){
      if(row.profPicType){
        if(row.profPicType.length &&  row.profPicType==="default"){
            // console.log("I rendered")
            return row.profPic;
        }
        else{
          if(row.profPicType==="user"){
            console.log("I rendered")
            return `${API_BASE_URL}/${row.profPic.replace(/\\/g, "/")}`
            
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
    console.log("My competitor Data is ",competitorData)
  })


    return <>
        <section className="compare-analytics-template">
            {/* <h2>Comparison Analytics</h2> */}
             <div className="compatitors-line-up">
                <NavLink className="avatar-display" to={`/protected/layout/profile`}>
                    <StyledProf value={{data:sessionData.userData,imager:imagerResolver}}></StyledProf>
                    <span style={{color:"green", fontSize:"12px",fontWeight:600}}>{sessionData.userData.roll_number}-You👈👈</span>
                </NavLink>
                
                <h2 className="comp-vs"> VS</h2>
                <NavLink className="avatar-display" to={`/protected/layout/visitor-profile?roll_number=${comp_roll_number}`}>
                    <StyledProf value ={{data:competitorData,imager:imagerResolver}}></StyledProf>
                    <span style={{color:"crimson",fontSize:"12px",fontWeight:600}}>{comp_roll_number}</span>
                </NavLink>
                
             </div>
             <div className="my-competion-links">
                <NavLink className={({isActive})=>{
                  return  (isActive) ? "try-this-1" : "try-this-0"
                }} to={`sgpa-compare?roll_number=${comp_roll_number}`}>SGPA</NavLink>
            <NavLink className={({isActive})=>{
                  return  (isActive) ? "try-this-1" : "try-this-0"
                }} to={`semester-compare?roll_number=${comp_roll_number}&semester=${1}`}>
                  Semester-1
                  </NavLink>
            <NavLink className={({isActive})=>{
                  return  (isActive) ? "try-this-1" : "try-this-0"
                }} to={`semester-compare?roll_number=${comp_roll_number}&semester=${2}`}>Semester-2</NavLink>
            {/* <NavLink className={({isActive})=>{
                  return  (isActive) ? "try-this-1" : "try-this-0"
                }} to={`semester-compare?roll_number=${comp_roll_number}&semester=${3}`}>Semester-3</NavLink> */}
             </div>
            
            <div className="compare-analytics-outlet">
                <Outlet/>
            </div>
        </section>
    </>
}


const StyledProf = styled.div`
    height:50px;
    width:50px;
    border-radius:50%;
    background-image:url(${ (props)=>{return (props.value.data.profPicType && props.value.data.profPicType!=="null") ? `${props.value.imager(props.value.data)}`:"data:image/jpeg;base64,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"}});
    background-position:center;
    background-size:cover;
`


export default ComparisonAnalytics
