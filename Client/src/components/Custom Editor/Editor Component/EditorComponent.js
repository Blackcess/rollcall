import "./EditorComponent.css";
import React, { useEffect, useMemo, useRef } from "react";
import ReactQuill, {Quill} from "react-quill";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import TableUI from "quill-table-ui";
import hljs from "highlight.js"
import ImageResize from "quill-image-resize-module-react"
import {ImageDrop} from "quill-image-drop-module"
import "highlight.js/styles/github.css";
import "quill-table-ui/dist/index.css";
import { FcUndo } from "react-icons/fc";
import { FcRedo } from "react-icons/fc";


const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function EditorComponent({ value, setValue,title,editMode }) {
  const quillRef = useRef();



  // ✅ Register with Quill
    Quill.register("modules/imageResize", ImageResize);
    Quill.register("modules/imageDrop", ImageDrop);
  // enable syntax highlighting in code blocks
  hljs.configure({
    languages: ["javascript", "python", "html", "css", "sql"], // add your preferred ones
  });

  // get user content from the session storage
  useEffect(()=>{
    const savedContent = sessionStorage.getItem("draft_content");
    const savedTitle = sessionStorage.getItem("draft_title");

    if (savedContent) {
        if (savedContent) setValue(savedContent);
        // if (savedTitle) setTitle(savedTitle);
      } else {
        sessionStorage.removeItem("draft_title");
        sessionStorage.removeItem("draft_content");
      }
  },[])

  useEffect(() => {
    sessionStorage.setItem("draft_content", value);
  }, [value]);

  useEffect(() => {
    sessionStorage.setItem("draft_title", title);
  }, [title]);

 

  // 🖼️ Custom Image Handler
  const imageHandler = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await axios.post(
          `${API_BASE_URL}/uploads/article-image`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );

        const imageUrl = `${API_BASE_URL}`+res.data.url;
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection(true);

        if (range) {
          editor.insertEmbed(range.index, "image", imageUrl);
          editor.setSelection(range.index + 1);
        } else {
          editor.insertEmbed(editor.getLength(), "image", imageUrl);
        }

      } catch (err) {
        console.error("Image upload failed:", err);
        alert("Image upload failed. Please try again.");
      }
    };
  };
  // history module handlers
  const handleUndo = () => {
    const editor = quillRef.current?.getEditor();
    if (editor) editor.history.undo();
  };

  const handleRedo = () => {
    const editor = quillRef.current?.getEditor();
    if (editor) editor.history.redo();
  };
    // ✅ Keep toolbar static using useMemo
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: "#custom-toolbar", // must match toolbar div ID
        handlers: {
          image: imageHandler,
          undo: handleUndo,
          redo: handleRedo,
        },
      },
      syntax: {
      highlight: (text) => hljs.highlightAuto(text).value,
    },
    imageResize: {
      // optional configs
      parchment: Quill.import("parchment"),
      modules: ["Resize", "DisplaySize", "Toolbar"],
    },
    history: {
      delay: 1000,
      maxStack: 100,
      userOnly: false,
    },
    imageDrop: true,
   
      
    };
  }, []);

 const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "align",
  "link",
  "image",
  "video",
  "table",
  "code"
];
  //   
  return (
      <>
        
    <div className="editor-wrapper" style={{ width: "100%" }}>
      {/* ✅ Static custom toolbar */}
      <div id="custom-toolbar" style={{ marginBottom: "10px" }}>
        <select className="ql-header" defaultValue="">
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="">Normal</option>
        </select>
        <button className="ql-bold"></button>
        <button className="ql-italic"></button>
        <button className="ql-underline"></button>
        <button className="ql-strike"></button>
        <button className="ql-blockquote"></button>
        <button className="ql-list" value="ordered"></button>
        <button className="ql-list" value="bullet"></button>
        <button className="ql-link"></button>
        <button className="ql-code"></button>
        <button className="ql-code-block"></button>
        <button className="ql-link"></button>
        <button className="ql-image"></button>
        <button className="ql-video"></button>
        <select className="ql-align" defaultValue="">
          <option value=""></option>
          <option value="center"></option>
          <option value="right"></option>
          <option value="justify"></option>
      </select>
      <span className="ql-formats">
        <button className="ql-undo">
          <FcUndo />
        </button>
        <button className="ql-redo">
          <FcRedo/>
        </button>
      </span>
        <button className="ql-clean"></button>
      </div>   

      {/* ✅ Editor itself */}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || "<p><br/> Re-rendered</p>"}
        onChange={setValue}   
        modules={modules}
        formats={formats}
        style={{ height: "700px", backgroundColor: "#f4f4f4ff" }}
      />  

    </div>
      </>
  );
}
