import { useLocation, useNavigate } from "react-router-dom"
import "./ActualViewer.css"
import axios from "axios";
import { useEffect, useState } from "react";
import ArticlePreview from "../Editor Component/PreviewMode";

const API_BASE_URL = process.env.REACT_APP_API_URL;
function ActualViewer(){
    const [content,setContent]= useState({});
    const [contentLoaded,setContentLoaded]= useState(false);
    const {search} = useLocation();
    const urlSearchParams = new URLSearchParams(search)
    const article_id = urlSearchParams.get("id");
    const navigation = useNavigate()
    console.log("My article Parameter is ", article_id)
     useEffect(()=>{
        fetchContent();
    },[])
    const fetchContent= async ()=>{
        if(!article_id){
            return 
        }
        try {
            const response = await axios.get(`${API_BASE_URL}/study-articles/${parseInt(article_id)}`);
            if(response.data.status){
                console.log("Fetched Articles:", response.data.data);
                setContent(response.data.data);
                setContentLoaded(true);
            }
        } catch (error) {
            console.error("Error fetching content:", error);
        }
    }


    return<>
    <section className="my-actual-content-display">
        <div className="actual-cont-display-container">
            <div className="prop-add-scheme">
                <button className="prop-btn" onClick={()=>navigation(`/protected/layout/editor?edit="true"&id=${content.id}`)}>Update Article</button>
                <ArticlePreview previewMode={true} content={content.content_html}/>
            </div>
            <div className="content-meta-data">
                <p className="content-summary">{content.summary}</p>
                <div className="author-info">
                    <span>Published By Thomas</span> | <span>{new Date(content.created_at).toLocaleDateString()}</span>
                </div>

            </div>
        </div>
    </section>
    
    </>
}

export default ActualViewer