import "./MobileDashBoard.css"
import MobileSemesters from "./Semesters/MobileSemesters"
function MobileDashBoard(){

    return <>
    <section className="mobile-dash-template">
        {/* <h1 className="mobile-dash-heading">Dashboard</h1> */}
        <div className="mobile-dash-info"></div>
       
        <MobileSemesters/>
        
        
    </section>
    
    </>
}



export default MobileDashBoard