import { NavLink } from "react-router-dom";
import "./StasSelection.css"

function StatsSelection(){
    let links  = [{
        title:"My SGPA",
        link:"/protected/layout/my-sgpa"
    },{
        title:"Compare with friends",
        link:"/protected/layout/compare-grades"
    }]
    return<>
    <section className="academic-stats-selection">
        <h3>Academic Statistics</h3>
        <div className="academic-stats-list">
            {
                links.map((row,index)=>(
                    <NavLink className="list-of-stats-template" to={`${row.link}`} key={index}>
                        {row.title}
                    </NavLink>
                ))
            }
        </div>
    </section>
    </>
}


export default StatsSelection;