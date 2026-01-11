import axios from "axios";
import "./AuthorPanel.css"
import { useAuth } from "../../../Aunthentication/AuthProvider";
import ShimmerLoader from "../../Util Components/ShimmerLoader/ShimmerLoader";
import { toast } from "react-toastify";


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL;
function ArticlesTable({ articles, onEdit, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // number of articles per page

  // Pagination logic
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedArticles = articles.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(articles.length / pageSize);
    const placeholder =
    "https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/45/e2/6b/ae/fb/v1_E10/E103ED1Y.jpg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=85403bbaebd509200c1af4cf0087e317cfec13152379dade77063c6ee84a902a";
  return (
    <div className="aut-pan-temp">
      <table className="articles-table">
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Title</th>
            <th>Subject</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {paginatedArticles.map((article) => (
            <tr key={article.id}>
              <td>
                <img
                  src={(article.thumbnail_url)? article.thumbnail_url :placeholder}
                  alt={article.title}
                  style={{ width: "60px", height: "40px", borderRadius: "4px" }}
                />
              </td>

              <td>{article.title}</td>
              <td>{article.subject}</td>

              <td>
                <button onClick={() => onEdit(article.id)}>Edit</button>
              </td>

              <td>
                <button
                  onClick={() => onDelete(article.id)}
                  style={{ color: "red" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}





function AuthorDashboard() {
    const sessionData = useAuth();  
    const [articles, setArticles] = useState([]);
    const [articlesLoaded, setArticlesLoaded] = useState(false);
    const navigate = useNavigate();
    useEffect(()=>{
        getMyArticles();
    },[])
    const getMyArticles= async ()=>{
        if(!sessionData.userData){
            throw new Error("You are not an authorized Author")
        }
        console.log("Sesession: "   ,sessionData.userData.roll_number)
        
        try {
            let res = await axios.get(`${API_BASE_URL}/study-articles/findByAuthor`,{
                withCredentials:true
            })
            if(res.data.status){
                console.log("Author's Articles:", res.data);
                setArticles(res.data.data);
                setArticlesLoaded(true);
            }
        } catch (error) {
            console.error("Error fetching author's articles:", error);
        }
    }
    const deleteArticle = async (id)=>{
        try {
            const res = await axios.delete(`${API_BASE_URL}/study-articles/${id}`,{
                withCredentials:true
            }
            )
            if(res.data.success){
                toast.success("Article Deleted Successfully",{
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                  });
            }
        } catch (error) {
            console.error("Error deleting article:", error);
            toast.error("Error Deleting Article",{
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
              });   
        }
    }
  const handleEdit = async(id) => {
    navigate(`/protected/layout/editor?edit="true"&id=${id}`)
  };

  const handleDelete = async (id) => {
    const res = window.confirm("Are you sure you want to delete this article?")
    if(res){
        await deleteArticle(id);
    }
  };

  return (
    // <ArticlesDashboard>
      <>
        {(articlesLoaded) ? <ArticlesTable articles={articles} onEdit={handleEdit} onDelete={handleDelete} />  : <ShimmerLoader/>}
      </>
    // </ArticlesDashboard>
  );
}

export default AuthorDashboard;
