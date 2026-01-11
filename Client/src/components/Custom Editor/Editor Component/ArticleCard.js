import React from "react";
import "./ArticleCard.css";

const ArticleCard = ({ article, onClick }) => {
  // Default placeholder if no thumbnail is provided
  const placeholder =
    "https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/45/e2/6b/ae/fb/v1_E10/E103ED1Y.jpg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=85403bbaebd509200c1af4cf0087e317cfec13152379dade77063c6ee84a902a";

//   const {
//     author,
//     created_at,
//     thumbnail_url,
//     summary,
//     subject,
//   } = article;

  const formattedDate = article.created_at
    ? new Date(article.created_at).toLocaleDateString()
    : "Unpublished";

  return (
    <div className="article-card" onClick={onClick}>
      {/* Thumbnail */}
      <div className="thumbnail-wrapper">
        <img
          src={article.thumbnail_url || placeholder}
          alt={article.title}
          className="article-thumbnail"
        />
      </div>

      {/* Info section */}
      <div className="article-info">
        <h3 className="article-title">{article.title}</h3>

        <div className="article-meta">
          <span className="article-author">{article.author}</span>
          <span className="article-date"> {formattedDate}</span>
        </div>

        {article.subject && <div className="article-subject">{article.subject}</div>}

        {/* {article.summary && (
          <p className="article-description">
            {article.summary.length > 100
              ? article.summary.slice(0, 100) + "..."
              : article.summary}
          </p>
        )} */}
      </div>
    </div>
  );
};

export default ArticleCard;
