import { useEffect, useState } from "react";
import "./UploadPic.css"
import { useAuth } from "../../../Aunthentication/AuthProvider";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

function UploadPic(){
    let [submitStatus,setSubmitStatus] = useState(false);
    let sessionData = useAuth()
    useEffect(()=>{
        if(submitStatus){
            const formData = new FormData();
            const fileInput = document.querySelector('.upload-file-input');
            formData.append("profilePicture",fileInput.files[0]);
            if(fileInput.files.length){
               uploadFile(formData);
            }
        }
    },[submitStatus])
    
    
     async function uploadFile(formData) {
                        try {
                            const result=  await axios.post(`${API_BASE_URL}/uploads`,formData,{
                            withCredentials:true
                                }
                            )
                            if(result.data.status){
                                console.log("Yeess",result.data,sessionData)
                                sessionData.refresh()
                            }

                            
                        } catch (error) {
                            console.log("Error",error)
                        }
                }

    return <>
    <section className="my-personal-pic-template">
        <h4>Add Custom Image</h4>

        <div className="pro-img-upload">
            <form className="my-upload-form">
                <input type="file" className="upload-file-input" accept="image/*"/>
                <button className="send-btn" onClick={(e)=>{
                    e.preventDefault()
                    setSubmitStatus(true)
                }}>Upload</button>
            </form>
        </div>
    </section>
    
    </>
}

export default UploadPic