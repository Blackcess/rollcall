import { useContext, useEffect } from "react"
import { lectureContext } from "../../LectureDetails"

export function LectureNotes(){
    const parentContext = useContext(lectureContext)
    useEffect(()=>{
        // console.log("Summary Props are ", parentContext)
    })
    return <>
            {/* Notes */}
            <div className="detail-block">
                <h3>Additional Notes</h3>
                <p>{parentContext.session.notes || "No notes provided."}</p>
            </div>
    </>
}