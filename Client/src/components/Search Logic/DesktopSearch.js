import "./DesktopSearch.css"
import { CiSearch } from "react-icons/ci";
function DesktopSearch(){

    return <>
    <div className="search-container">
        <div className="search-icon"><CiSearch/></div>
        <input className="desktop-search-input" type="text" placeholder="Search..."/>
    </div>
    
    </>
}
export default DesktopSearch