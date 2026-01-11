import "./PreviewMode.css";
import React, { useEffect, useRef } from "react";
import { patchImageUrls } from "../../../utils_functions/assignmentLongSolutionGenerator";

const API_BASE_URL = process.env.REACT_APP_API_URL;
export default function ArticlePreview({ previewMode,content }) {
  const previewRef = useRef(null);

  useEffect(() => {
    if (previewRef.current) {
      const images = previewRef.current.querySelectorAll("img");
      // console.log("Images in the article are: ",images)
      images.forEach((img) => img.classList.remove("banner-img"));

      if (images.length > 0) {
        const firstImg = images[0];

        // Wait until the image is loaded to check dimensions
        const checkImage = () => {
          const aspectRatio = firstImg.naturalWidth / firstImg.naturalHeight;

          // ✅ Check if the image is landscape and large enough
          if (aspectRatio > 1.3 && firstImg.naturalWidth > 600) {
            firstImg.classList.add("banner-img");
          } else {
            firstImg.classList.add("normal-img");
          }
        };

        if (firstImg.complete) {
          checkImage();
        } else {
          firstImg.onload = checkImage;
        }
      }
    }
  }, [content]);
 


  return (
    <>
    <div
          ref={previewRef}
          className="ql-editor article-preview article-viewer"
          dangerouslySetInnerHTML={{ __html: patchImageUrls(content,API_BASE_URL) }}
          style={{
           display: previewMode ? "block" : "none",
          }}
        />
    </>

  );
}
