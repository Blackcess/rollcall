import { useContext, useEffect } from "react"
import { lectureContext } from "../../LectureDetails"

export function LectureFiles(){
    const parentContext = useContext(lectureContext)
    useEffect(()=>{
        console.log("Summary Props are ", parentContext)
    })
    return <>
            
        {/* Files */}
        <div className="detail-block">
          <h3>Files</h3>
          {parentContext.files?.length > 0 ? (
            <ul className="file-list">
              {parentContext.files.map((file) => (
                <li key={file.id}>
                  <a
                    href={`${process.env.REACT_APP_API_URL+file.file_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.file_name}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No files uploaded.</p>
          )}
        </div>
    </>
}