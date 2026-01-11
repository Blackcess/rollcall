import "./StudyArticle.css";
import React, { useEffect, useState } from "react";
import EditorComponent from "./Editor Component/EditorComponent";
import axios from "axios";
import slugify from "slugify";
import ArticlePreview from "./Editor Component/PreviewMode";
import { useLocation, useNavigate } from "react-router-dom";
import ArticleMetaPanel from "./Editor Component/ArticleMetaPanel";
import AddArticleRelation from "./Editor Component/AddArticleRelation";
import { IoMenuSharp } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import validateThumbnail from "../../utils_functions/validateThumbnail";
import { useAuth } from "../../Aunthentication/AuthProvider";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function ArticleEditorPage() {
  const [content, setContent] = useState("<p><br/></p>"); // ✅ valid initial HTML
  const [metaData,setMetaData] = useState({
    title:"",
    subject:null,
    thumbNailUrl:"",
    description: "",
    tags:"",
    isPublished:true
  })
  const [articleEdit,setArticleEdit]= useState({})
  const [contentLoadedEdit,setContentLoadedEdit] = useState(false)
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [chooseRelation,setChooseRelation] = useState(false)    //state that controls the relations tab...
  const [relatedArticles,setRelatedArticles] = useState([]);   //stores the id of related articles...
  const [metadataMenuOpen,setMetadataMenuOpen] = useState(false);
  const {search} = useLocation();
  const sessionData = useAuth();
  const queryParams = new URLSearchParams(search);
  const navigation = useNavigate()
  var editMode = queryParams.get("edit")
  const articleId = queryParams.get("id");
   if(editMode===undefined){
    editMode=false
  }
  else{
    editMode=true
  }
  useEffect(()=>{
    console.log('Session Info',sessionData)
    if(editMode && articleId){
      fetchArticleToEdit(articleId);
    }
  },[])

  const fetchArticleToEdit = async (id) =>{
    try {
      const response = await axios.get(`${API_BASE_URL}/study-articles/${id}`, { withCredentials: true });
      if (response.data.status) {
        const article = response.data.data;
        // console.log("Fetched Article for Edit:", article);
        setContent(article.content_html || "<p><br/></p>");
        setArticleEdit(article)
        setContentLoadedEdit(true)
      }
    } catch (error) {
      console.error("Error fetching article for edit:", error);
    }
  }

  const addRelatedeArticles= (r_articles)=>{
    setRelatedArticles(r_articles)
  }
 useEffect(()=>{
      if(editMode){
        setMetaData(()=>{
          return  {
            title:articleEdit.title,
            subject:articleEdit.subject_id,
            description:articleEdit.summary,
            thumbNailUrl:articleEdit.thumbnail_url,
            tags:"",
            isPublished:true
          }
        } 
      )
      }
       
    },[contentLoadedEdit])

    // useEffect(()=>{
    //   console.log("Meatdata tracking Logs: ",metaData)
    // })

  const handleSave = async () => {
    
    if (!metaData.title || !content.trim()) {
      // alert("Please provide a title and some content.");
      toast.error("Please provide a title in the menu.",{
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
       toast.warn("Please provide some content in the editor.",{
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
     
      return;
    }
    // console.log("Thumbnail is : ",metaData)
    const {valid,message}=validateThumbnail(metaData.thumbNailUrl);
    if(!valid){
      toast.error(message,{
        position: "top-right",    
        autoClose: 3000,
        hideProgressBar: false,
      });
      return;
    }
    // check is subject is specified
    if (!metaData.subject || metaData.subject=="") {
      toast.error("Please select a subject in the metadata panel.",{
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      return;
    } 
   

    const slug = slugify(metaData.title, { lower: true, strict: true });
    setSaving(true);
    if(editMode && articleId){
      // Update existing article
      try {
        const res = await axios.put(`${API_BASE_URL}/study-articles/${articleId}`, {
          title:metaData.title,
          summary: metaData.description,
          content_html: content,
          content_delta: null,
          subject_id: metaData.subject,
          published: true,
          author_id: (sessionData.userData)? sessionData.userData.roll_number: 2305336, // temporary; replace later with auth ID
          slug,
          thumbnail_url:metaData.thumbNailUrl
        }, { withCredentials: true });
        // alert("✅ Article updated successfully!");
        toast.success("Article updated successfully!",{
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
      } catch (error) {
        console.error("Error updating article:", error);
        // alert("❌ Error updating article");
         toast.error("Error Updating article",{
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      }
      finally{
        setSaving(false);
        return;
      }
    }
    
    try {
      const res = await axios.post(
        `${API_BASE_URL}/study-articles`,
        {
          title:metaData.title,
          summary: metaData.description,
          content_html: content,
          content_delta: null,
          subject_id: metaData.subject,
          published: true,
          author_id: (sessionData.userData)? sessionData.userData.roll_number: 2305336, 
          slug,
          thumbnail_url:metaData.thumbNailUrl
        },
        { withCredentials: true }
      );

      // alert("✅ Article saved successfully!");
      toast.success("Article updated successfully!",{
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
      // console.log("Saved Article:", res.data);
       // 🧹 Clear the draft after successful save
      sessionStorage.removeItem("draft_title");
      sessionStorage.removeItem("draft_content");
    } catch (err) {
      console.error(err);
      // alert("❌ Error saving article");
      toast.error("Error saving article",{
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="article-editor-page">
      <div className="editor-toolbar-buttons">
        {(!metadataMenuOpen) ?<IoMenuSharp className="metadata-menu" onClick={()=>{
          setMetadataMenuOpen(!metadataMenuOpen)
        }}/>
      :
      <IoCloseSharp className="metadata-menu" onClick={()=>{
        setMetadataMenuOpen(!metadataMenuOpen)
      }}/>
      }
      <button className="manage-existing-articles" onClick={()=>{
          navigation(`/protected/layout/author-panel`);
        }}>My Articles</button>
        <button
          onClick={() => setPreviewMode(!previewMode)}
          style={{
            padding: "8px 14px",
            backgroundColor: previewMode ? "#28a745" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}>
          {previewMode ? "✏️ Switch to Editor" : "👀 Preview Article"}  
        </button>

       <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "8px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {saving ? "Saving..." : "Save Article"}
        </button>
      </div>

      {/* ✅ Keep both mounted: no unmount flicker */}
      <div className="editing-work-station">
        
        <div className="meta-data-insert">
          <ArticleMetaPanel metadata={metaData} onChange={(updated) => setMetaData(updated)} controlRelation={(state)=>setChooseRelation(state)} relationsState = {chooseRelation}/>
        </div>
        {(metadataMenuOpen) &&<div className="meta-data-insert-mobile">
          <ArticleMetaPanel metadata={metaData} onChange={(updated) => setMetaData(updated)} controlRelation={(state)=>setChooseRelation(state)} relationsState = {chooseRelation}/>
        </div>}
          {(!chooseRelation) ?<div style={{ position: "relative" }} className="editor-preview-container">
            {/* Editor (hidden in preview mode) */}
            <div className="editor-compo-template"
              style={{
              display: previewMode ? "none" : "block",
              transition: "opacity 0.2s ease-in-out",
              }}
            >
              <EditorComponent value={content} setValue={setContent} title={metaData.title} editMode={editMode}/>
              {/* <pre>{content}</pre> */}
            </div>

            {/* Preview (hidden in editor mode) */}
            <ArticlePreview previewMode={previewMode} content={content}/>
          </div>
          :
          <AddArticleRelation add={addRelatedeArticles} alreadyRelated = {relatedArticles} />}
       
      
      
      </div>
    
    </div>
  );
}