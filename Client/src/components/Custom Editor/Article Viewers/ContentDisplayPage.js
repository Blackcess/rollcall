import { useEffect, useState } from "react";
import "./ContentDisplayPage.css"
import axios from "axios";
import ArticlePreview from "../Editor Component/PreviewMode";
import { useNavigate } from "react-router-dom";
import ArticleCard from "../Editor Component/ArticleCard";
import { IoAdd } from "react-icons/io5";
import { useAuth } from "../../../Aunthentication/AuthProvider";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.REACT_APP_API_URL;

function ContentDisplayPage(){
    const [content,setContent]= useState([]);
    const [contentLoaded,setContentLoaded]= useState(false);
    const navigation = useNavigate();
    let sessionData = useAuth();
    useEffect(()=>{
        fetchContent();
        // async function test (){
        //       console.log("SessionData is ,",await sessionData.myResults());
        // }
        // test();
        // console.log("User Data in Content Display Page is ",sessionData.userData);

      
    },[])
    const fetchContent= async ()=>{
        try {
            const response = await axios.get(`${API_BASE_URL}/study-articles/all`);
            if(response.data.status){
                // console.log("Fetched Articles:", response.data.data);
                setContent(response.data.data);
                setContentLoaded(true);
            }
        } catch (error) {
            console.error("Error fetching content:", error);
        }
    }
    

    return <>
    <section className="my-content-display">
        {([2305336,2305311].includes(sessionData.userData.roll_number)) &&<button className="create-article-contention-btn" onClick={(e)=>{
            if(![2305336,2305311].includes(sessionData.userData.roll_number)){
                toast.error("Only Thomas and Justin can create new articles.",{
                    position: "top-right",
                    autoClose: 3000,    
                    hideProgressBar: false,
                    });
                return;
            }
            navigation("/protected/layout/editor");
        }}>
            <span style={{fontSize:"18px",display:"flex",justifyContent:"center",alignItems:"center"}}><IoAdd/></span>
            <span>New Article</span>
        </button>}
        {(content.length)?<div className="content-display-container">
            <ArticleList_Big articles={content}/>

        </div>
        :
        <p>No Content Published by Authors</p>}
    </section>
    </>
}

const ArticleList_Big = (props)=>{
    const navigation = useNavigate();
    return <>
        <section className="big-article-list">
            {
                props.articles.map((a,i)=>{
                    return <ArticleCard article={a} key ={i} onClick={()=>navigation(`/protected/layout/study-material-viewer?id=${a.id}`)}/>
                })
            }
        </section>


    </>
}

export default ContentDisplayPage;