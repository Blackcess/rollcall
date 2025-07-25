import "./EditProfile.css"
import styled from "styled-components"
import axios from "axios";
import { useState,useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Aunthentication/AuthProvider";
import { MdOutlineAddBox } from "react-icons/md";

const API_BASE_URL = process.env.REACT_APP_API_URL;


function EditProfile(){

    let [submitStatus,setSubmitStatus]= useState(false);
    let [defaultSelected,setDefaultSelected] = useState(false);
    let [defaultPicPath,setDefaultPicPath]= useState("");
    let [updatedefaultDone,setUpdateDefaultDone]= useState(false);
    let navigate= useNavigate();
    let sessionData = useAuth();

    let defaultImages  = [
        {
            gender:"male",
            path:"https://icon-library.com/images/default-profile-icon/default-profile-icon-18.jpg"
        },{
            gender:"male",
            path:"https://previews.123rf.com/images/yupiramos/yupiramos1705/yupiramos170514532/77987159-young-man-profile-icon-vector-illustration-graphic-design.jpg"
        },
        {
            gender:"female",
            path:"https://wallpapers.com/images/hd/good-tiktok-profile-pictures-1080-x-1080-a5fxkf66f15mp227.jpg"
        },
        {
            gender:"female",
            path:"https://img.freepik.com/premium-vector/default-female-user-profile-icon-vector-illustration_276184-169.jpg"
        },
        {
            gender:"female",
            path:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfHIN7plLE9DcUC9J3oGGrGKa_mLg2lAjk3BTSbtGPzZnyLvmXJNYBICfezIZmpLLblAs&usqp=CAU"
        },
        {
            gender:"male",
            path:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV27MyZR3Uan_EkyIaXutacTJ-XVzSt_H1cA&s"
        },
            {
            gender:"male",
            path:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgxf_SpG3Xs3hIV-HhF4sG2YxQ74AygOkFHRfvOFcrfh2WdGxM2C1VdzhEGXoJrkiuG-k&usqp=CAU"
        },
        {
            gender:"female",
            path:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiecKKm6AP-XACEKJhggJ1i7EAHOHBhE0fiQ&s"
        },
        {
            gender:"female",
            path:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDuQgpYEVrPy3Tb6bwT3raXHm3K5Tfp7HxHw&s"
        },
        {
            gender:"male",
            path:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv08IFzcctSGreK52O63jDJ38FFFr3FfAdFw&s"
        }
    ]

        useEffect(()=>{
            if(submitStatus){
                    async function uploadDefault(){
                        try {
                            const result = await axios.post(`${API_BASE_URL}/default-pic`,{
                                path:defaultPicPath
                            },{
                                withCredentials:true
                            })
                            if(result.data.status){
                                setDefaultSelected(false)
                                setUpdateDefaultDone(true);
                                navigate(`/protected/layout/profile/?refresh=${Date.now()}`)
                            }
                        } catch (error) {
                            console.log("err",error)
                        }
                    }
                    
                    if(defaultSelected){
                        uploadDefault();
                    }
                    
        
            }
  },[submitStatus,defaultSelected])

  const getSubmitStatus=(status,path)=>{
        setDefaultPicPath(path);
        setSubmitStatus(status);
        setDefaultSelected(true);

  } 
    return <>
        <section className="avar-selection-section">
            <h3 className="select-avatar-heading">Select Profile Image</h3>
            {(!defaultSelected) &&<div className="default-avatars">
                {
                    defaultImages.map((row,index)=>(
                        <DefaultAvatar value={{feedback:getSubmitStatus,path:row.path,refresh:sessionData.refresh} } key={index}/>
                    ))
                }
                
            </div>}
            <div className="user-select-profile">
                <NavLink className="link-selct-user-profile" to="/protected/layout/profile/edit-personal-pic">
                   <span>Upload Profile Image</span> 
                    <span className="add-personal-icon"><MdOutlineAddBox /></span>
                </NavLink>
            </div>
        </section>
    </>
}


function DefaultAvatar(props){

  
    return<>
        <MyStyledPic value={{path:props.value.path}} className="my_default-avatar-comp" onClick={(e)=>{
            props.value.feedback(true,props.value.path);
            props.value.refresh();
        }}>
            
        </MyStyledPic>
    </>
}

  const MyStyledPic = styled.section`
         height: 50px;
         width: 50px;
         border-radius: 10px;
         background-image:url(${(props)=>{return  props.value.path}});
         background-position:center;
         background-size:cover;
         border:0.5px solid gray;
    `

export default EditProfile