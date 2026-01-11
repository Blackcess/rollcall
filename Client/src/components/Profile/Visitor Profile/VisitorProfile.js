import { useEffect, useLayoutEffect } from "react";
import "./VisitorProfile.css"
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import styled from "styled-components";
const API_BASE_URL = process.env.REACT_APP_API_URL;
function VisitorProfile(){

    const {search} = useLocation();
    const myParams = new URLSearchParams(search)
    const roll_number = myParams.get("roll_number")
    let [allData,setAllData]= useState([]);
    let [dataDone,setDataDone] = useState(false);
    const [visitor,setVisitor] = useState({});
    const [visitorDone,setVisitorDone] = useState(false);
    const [personalDetailsState,setPersonalDetailsState] = useState(false);
    const [personalData,setPersonalData]= useState({});
    const [visitorsFollowers,setVisitorFollowers] = useState({});

    useEffect(()=>{
       getAllCompetitors();
    },[])

    async function  getAllCompetitors(){
                
                try {
                    const result=await axios.get(`${API_BASE_URL}/students/all`,{
                                withCredentials:true
                        })
                        if(result.data.status){
                            setDataDone(true);
                            setAllData([...result.data.value])
                        }
                } catch (error) {
                    setDataDone(false)
                    console.error(error)
                }
            }
    function imagerResolver(row){
          if(row.profile_picture_type){
            if(row.profile_picture_type.length &&  row.profile_picture_type==="default"){
              return row.profile_picture;
            }
            else{
              if(row.profile_picture_type==="user"){
                return `${API_BASE_URL}/${row.profile_picture.replace(/\\/g, "/")}`
              }else{
                console.log("profPicType is empty")
              }
            }
          }
          else{
            console.log("profPicType is not defined")
          }
      }

      async function getPersonalDetails(){

        
        try {
            const response = await axios.get(`${API_BASE_URL}/personal-details/visitor?roll_number=${visitor.roll_number}`,{
              withCredentials:true
              }) 
              console.log("This is the data rom the database",response);
              if(response.data.data.status){
                setPersonalData(()=>{return response.data.data.value[0]});
                setPersonalDetailsState(true)
              }
              else{
                setPersonalData(()=>{return {}});
                setPersonalDetailsState(false)
              }
        } catch (error) {
          console.log("error")
        }
      }

      async function getFollowers(roll_number){
          
          try {
            const response = await axios.get(`${API_BASE_URL}/student/getfollowers?roll_number=${roll_number}`,{
                  withCredentials:true
                })
            if(response.data.status){
              // console.log("Visitor Followers are...",response.data.data);
              setVisitorFollowers(()=>{
                return response.data.data[0];
              })
            }
          } catch (error) {
            console.error(error)
          }
      }  
        useEffect(()=>{
            if(dataDone){
                const temp = allData.find((row)=>row.roll_number ==parseInt(roll_number));
                if (temp) {
                setVisitor(()=>{return temp});
                setVisitorDone(true);
                
                }
            }
        })

        useEffect(()=>{
          if(visitorDone){
            getPersonalDetails();
            getFollowers(roll_number)
          }
        },[visitorDone])

        

    return <>
    {(visitorDone)  && <section className="my-visitor-section-template">
        <div className="visitor-profile-details">
            <div className="visitor-prof-pic"><StyledProf value={{data:visitor,imager:imagerResolver}}></StyledProf></div>
            
            <div className="visitor-details-wrapper">
              <div className="visitor-dets">
                <span className="visitor-name">{visitor.student_name}</span>
                <span className="visitor-mode">Student</span>
                <span className="visitor-college">{visitor.roll_number}</span>
            </div>
            </div>
        </div>
        <div className="visitor-followers">
              <div className="followers-section-vis">
                <span className="act-foll">{visitorsFollowers.followers}</span>
                <span className="vis-foll-tit">Followers</span>
              </div>
              <div className="followers-section-vis">
                <span className="act-foll">{visitorsFollowers.following}</span>
                <span className="vis-foll-tit">Following</span>
              </div>
              <button className="follow-btn">Follow</button>
            </div>
        <div className="personal-infomation">
          <h4>Personal Information</h4>
          <div className="visitor-personal-info">
              {
                (!personalDetailsState) ? 
                <div>No Recorded information for this  user</div>
                :
                <div className="vis-data">
                  {
                    Object.keys(personalData).map((key,index)=>{
                        return <VisitorDetails key={index} value={{key:key,value:personalData[key]}}/>
                    })
                  }

                </div>
              }
          </div>
        </div>
    </section>
    }
    </>
}

const StyledProf = styled.div`
    height:100px;
    width:100px;
    border-radius:50%;
    background-image:url(${(props)=>{return (props.value.data.profile_picture) ? `${props.value.imager(props.value.data)}`:"data:image/jpeg;base64,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"}});
    background-position:center;
    background-size:cover;

    `

    function VisitorDetails(props){
      return <>
      
      <section className="user-details-vistor-section">
        <div className="data-key">{props.value.key}</div>
        <div className="data-value">{props.value.value}</div>
      </section></>
    }
export default VisitorProfile