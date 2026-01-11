import { useContext, useEffect } from "react"
import { lectureContext } from "../../LectureDetails"

export function LectureTopics(){
    const parentContext = useContext(lectureContext)
    useEffect(()=>{
        // console.log("Summary Props are ", parentContext)
    })
    return <>
            {/* Topics */}
            <div className="detail-block">
                <h3>Topics Covered</h3>
                <p>{parentContext.session.topics || "No topics shared."}</p>
            </div>
    </>
}