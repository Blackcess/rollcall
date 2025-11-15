import "./MobileLayout.css"
import { FaHome } from "react-icons/fa";
import { FcAbout } from "react-icons/fc";
import { AiOutlineLogout } from "react-icons/ai";
import { AiOutlineProduct } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { VscSymbolClass } from "react-icons/vsc";
import { RxDashboard } from "react-icons/rx";
import MobileNav from "./Mobile Nav/MobileNav";
import { SiStudyverse } from "react-icons/si";



function MobileLayout(){
    let pages = ["Class","Dashboard","Profile","content"]
    let links=["class",`/protected/layout/dashboard/mobile/semester/${2}`,"profile","study-material"]
    let icons=[<VscSymbolClass/>,<RxDashboard/>,<CgProfile/>,<SiStudyverse/>]
    return <>
    <section className="mobile-layout-template">
        <div className="mobile-header">
            <MobileNav/>
        </div>
        <div className="mobile-main-area">
            <Outlet/>
        </div>
        <div className="mobile-navigation">
             <ul className="nav-list">
              {
                pages.map((page,index)=>(
                    <NavLink className="nav-page" to={links[index]} id="mobile-link" key={index}>
                        <span className="nav-icon">{icons[index]}</span>
                        <span className="nav-title">{page}</span>
                    </NavLink>
                ))
              }
            </ul>
        </div>


    </section>
    </>
}

export default MobileLayout