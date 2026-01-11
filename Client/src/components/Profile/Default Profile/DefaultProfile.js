import { NavLink, useNavigate } from "react-router-dom"
import { MdOutlineNavigateNext } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";


function DefaultProf(){


    let profile_option =[{title:"My Profile",value:"Change Profile Image/username/email/...",link:"myProfile"},
    {title:"My Academic Stats",value:"Compare Results/view Dashboards/...",link:"select-academic-stats"},
    {title:"Feedback",value:"Report Issues",link:""},
    ]
    const navigation = useNavigate()
    return<>
        <div className="profile-lower-part-2">
        <div className="prof-opt-header-log-out">
          <h3>Profile Settings</h3>
          <div className="mobile-logout-btn">
            <button className="mob-logout-btn" onClick={(e)=>{
              navigation("/protected/layout/logout")
            }}> <IoIosLogOut/>Logout</button>
          </div>
        </div>
        <div className="prof-opt-1">
          {
            profile_option.map((row,index)=>(
            <NavLink to={row.link} className="profile-links" key={index}>
                <ProfileOptions key={index} value={{title:row.title,value:row.value}}/>
            </NavLink>  
            ))
          }
        </div>
      </div>
    </>
}
function ProfileOptions(props){

  return<>
    <section className="profile-option-template">
      <div className="profile-option-template-1">
        <div className="profile-option-title">{props.value.title}</div>
       <div className="profile-option-value">{props.value.value}</div>
      </div>
      <div className="next-icon" ><MdOutlineNavigateNext/></div>
      
    </section>
  </>
}


export default  DefaultProf