import { useEffect, useState } from "react";
import "./AddArticleRelation.css"
import ArticleCard from "./ArticleCard";
import axios from "axios";
import styled from "styled-components";
import NoItemFoundComponent from "../../Util Components/No Items Found/NoItem";
const API_BASE_URL = process.env.REACT_APP_API_URL;
function AddArticleRelation(){
    const [articles,setArticles] = useState([]);
    const [articlesLoaded,setArticlesLoaded] = useState(false)

    useEffect(()=>{
        fetchAllArticles()
    },[])
    const fetchAllArticles = async ()=>{
        try {
            const res = await axios.get(`${API_BASE_URL}/study-articles/`,{
                withCredentials:true
            })
            if(res.data.status){
                console.log("All Article Lists",res.data.data)
                setArticles(res.data.data)
                setArticlesLoaded(true)
            }
        } catch (error) {
            console.error("Error fetching all articles",error)
        }
    }

    // useEffect(()=>{
    //     let temp = articles.filter()
    // },[articles])
    return <>
    <section className="add-relation-template">
        {(articlesLoaded)?<div className="article-list-to-be-related">
            {/* <ArticleCard article={articles[0]} onClick={()=>console.log("Display the selected article")}/>
            <ArticleCard article={articles[0]} onClick={()=>console.log("Display the selected article")}/>
            <ArticleCard article={articles[0]} onClick={()=>console.log("Display the selected article")}/>
            <ArticleCard article={articles[0]} onClick={()=>console.log("Display the selected article")}/>
            <ArticleCard article={articles[0]} onClick={()=>console.log("Display the selected article")}/>
            <ArticleCard article={articles[0]} onClick={()=>console.log("Display the selected article")}/>
            <ArticleCard article={articles[0]} onClick={()=>console.log("Display the selected article")}/>
            <ArticleCard article={articles[0]} onClick={()=>console.log("Display the selected article")}/>
            <ArticleCard article={articles[0]} onClick={()=>console.log("Display the selected article")}/>
            <ArticleCard article={articles[0]} onClick={()=>console.log("Display the selected article")}/>
            <ArticleCard article={articles[0]} onClick={()=>console.log("Display the selected article")}/>
            <ArticleCard article={articles[0]} onClick={()=>console.log("Display the selected article")}/> */}
            {
              (articles.length) ? articles.map((a,i)=>{
                return <ArticleCard article={a} key={i}/>
              })
              :
              <NoItemFoundComponent/>
            }
        </div>
        :
        <p>Loading...</p>
    }
    </section>
    </>
}

export default AddArticleRelation