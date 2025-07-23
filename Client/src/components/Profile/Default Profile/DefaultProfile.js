import { NavLink } from "react-router-dom"
import { MdOutlineNavigateNext } from "react-icons/md";

function DefaultProf(){


    let profile_option =[{title:"My Profile",value:"Change Profile Image/username/email/...",link:"myProfile"},
    {title:"My Academic Stats",value:"Compare Results/view Dashboards/...",link:"select-academic-stats"},
    {title:"Feedback",value:"Report Issues",link:""},
    ]
    return<>
        <div className="profile-lower-part-2">
        <h3>Profile Settings</h3>
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