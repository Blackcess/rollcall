import { Outlet } from "react-router-dom"
import "./CompareGrades.css"

function CompareGrades(){

    return <>
        <section className="copare-data">
            <h2>Grade Comparisons</h2>
            <div>
                <Outlet/>
            </div>
        </section>
    </>
}

export  default CompareGrades