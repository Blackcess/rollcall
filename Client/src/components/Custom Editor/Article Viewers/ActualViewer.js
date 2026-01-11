import { useLocation, useNavigate } from "react-router-dom"
import "./ActualViewer.css"
import axios from "axios";
import { useEffect, useState } from "react";
import ArticlePreview from "../Editor Component/PreviewMode";
import { useAuth } from "../../../Aunthentication/AuthProvider";
import { toast } from "react-toastify";
import { SlLike } from "react-icons/sl";
import { AiFillLike } from "react-icons/ai";
import { LiaCommentSolid } from "react-icons/lia";

const API_BASE_URL = process.env.REACT_APP_API_URL;
function ActualViewer(){
    const [content,setContent]= useState({});
    const [contentLoaded,setContentLoaded]= useState(false);
    const [likeMetric,setLikeMetric] = useState({})
    const [metricsDone,setMetricsDone]= useState(false)
    const [likeStatus,setLikeStatus] = useState(false)
    const [likeStatusDone,setLikeStatusDone] = useState(false)
    const [refresh,setRefresh] = useState(0)
    const {search} = useLocation();
    const urlSearchParams = new URLSearchParams(search)
    const article_id = urlSearchParams.get("id");
    const navigation = useNavigate()
    let sessionData = useAuth();
    // console.log("My article Parameter is ", article_id)
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
                // console.log("Fetched Articles:", response.data.data);
                setContent(response.data.data);
                setContentLoaded(true);
                await getLikes(response.data.data)
                await getLikedStatus(response.data.data)    
            }
        } catch (error) {
            console.error("Error fetching content:", error);
        }
    }

    const getLikes= async (data)=>{
        try {
            const res = await axios.get(`${API_BASE_URL}/article/likes/study-articles/${parseInt(data.id)}/metrics`,{
                withCredentials:true
            })
            if(res.data.status){
                console.log("Metrics data is ...",res.data.data)
                setMetricsDone(true)
                setLikeMetric(res.data.data)
            }
        } catch (error) {
            console.error("Error retrieving like counts",error)
            setMetricsDone(false)
        }
    }
    const getLikedStatus= async (data)=>{
        try {
            const res = await axios.get(`${API_BASE_URL}/article/likes/like-status/${parseInt(data.id)}`,{
                withCredentials:true
            })
            if(res.data.status){
                console.log("My like status is : ", res.data.liked)
                setLikeStatus(res.data.liked)
                setLikeStatusDone(true)
            }
        } catch (error) {
            console.error("Error in fetching like status...",error)
        }
    }
    const likeArticle= async ()=>{
        if(!content.id || !sessionData.userData){
            return 
        }
        try {
            const res = await axios.post(`${API_BASE_URL}/article/likes/like/${parseInt(content.id)}/${parseInt(sessionData.userData.roll_number)}`,{
                withCredentials:true
            })
            if(res.data.status){
                console.log("Liked  Successfully")
                setRefresh(refresh+1)
            }
        } catch (error) {
            console.error("liking post",error)
        }
    }
    const unlikeArticle = async ()=>{
        if(!content.id || !sessionData.userData){
            return
        }
        try {
            const res = await axios.post(`${API_BASE_URL}/article/likes/unlike/${parseInt(content.id)}/${parseInt(sessionData.userData.roll_number)}`,{
                withCredentials:false
            })
            if(res.data.status){
                console.log("Article unliked")
                setRefresh(refresh+1)
            }
        } catch (error) {
            console.error("error unliking post",error)
        }
    }
    useEffect(()=>{
        if(refresh===0 || !content.id){
            return
        }
        async function  redo(){
            await getLikes(content)
            await getLikedStatus(content)    
        }
        redo()
    },[refresh])
    return<>
    <section className="my-actual-content-display">
        <div className="actual-cont-display-container">
            <div className="prop-add-scheme">
                {([2305336,2305311].includes(sessionData.userData.roll_number)) &&<button className="prop-btn" onClick={()=>{
                    if(![2305336,2305311].includes(sessionData.userData.roll_number) ){
                        toast.error("Only Authorized Authors can edit articles.",{
                            position: "top-right",
                            autoClose: 3000,    
                            hideProgressBar: false,
                            });
                        return;
                    }
                    navigation(`/protected/layout/editor?edit="true"&id=${content.id}`)
                }}>
                        Update Article
                </button>}
                <ArticlePreview previewMode={true} content={content.content_html}/>
            </div>
            <div className="content-meta-data">
                <p className="content-summary">{content.summary}</p>
                <div className="author-info">
                    <span>Published By {content.author}</span> | <span>{new Date(content.created_at).toLocaleDateString()}</span>
                </div>
                {(metricsDone) && <div className="like-metrics">
                    <span className="likes-centr">
                        {(!likeStatus)?<SlLike className="metri-icon" onClick={(e)=>{
                            likeArticle()
                        }}/> : <AiFillLike className="metri-icon" onClick={()=>{
                            unlikeArticle()
                        }}/>}
                        {likeMetric.likes_count}
                        </span>
                    <span className="comments-centr">
                        <LiaCommentSolid className="metri-icon"/>
                        {likeMetric.comments_count}
                    </span>
                </div>}

            </div>
        </div>
    </section>
    
    </>
}

export default ActualViewer