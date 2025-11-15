import { useEffect, useState } from "react";
import "./ContentDisplayPage.css"
import axios from "axios";
import ArticlePreview from "../Editor Component/PreviewMode";
import { useNavigate } from "react-router-dom";
import ArticleCard from "../Editor Component/ArticleCard";

const API_BASE_URL = process.env.REACT_APP_API_URL;
function ContentDisplayPage(){
    const [content,setContent]= useState([]);
    const [contentLoaded,setContentLoaded]= useState(false);
    const navigation = useNavigate();
    useEffect(()=>{
        fetchContent();
    },[])
    const fetchContent= async ()=>{
        try {
            const response = await axios.get(`${API_BASE_URL}/study-articles/all`);
            if(response.data.status){
                console.log("Fetched Articles:", response.data.data);
                setContent(response.data.data);
                setContentLoaded(true);
            }
        } catch (error) {
            console.error("Error fetching content:", error);
        }
    }
    return <>
    <section className="my-content-display">
        {(content.length)?<div className="content-display-container">
            
          
            <ArticleList_Big articles={content}/>

        </div>
        :
        <p>No Content Published by Thomas</p>}
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