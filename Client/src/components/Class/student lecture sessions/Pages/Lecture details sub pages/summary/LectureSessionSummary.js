import { useContext, useEffect } from "react"
import { lectureContext } from "../../LectureDetails"

export function LectureSummary(){
    const parentContext = useContext(lectureContext)
    useEffect(()=>{
        // console.log("Summary Props are ", parentContext)
    })
return <>
        {/* Summary */}
        <div className="detail-block">
            <h3>Summary</h3>
            <p>{parentContext.session.summary || "No summary available."}</p>
        </div>
    </>
}