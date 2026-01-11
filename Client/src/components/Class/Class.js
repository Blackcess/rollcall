import { NavLink, Outlet, useLocation } from "react-router-dom"
import "./Class.css"
import { useScreenData } from "../Layout/Layout"
import { useEffect, useState } from "react"
import styled from "styled-components"
import AttendanceHome from "./Class Attendance/AttendanceHome"
import RetrieveAttendance from "./Class Attendance/RetrieveAttendance"
function Class(){
    const screenData = useScreenData()
    let location = useLocation();
    const isBaseRoute = location.pathname === "/protected/layout/class";
    let [bgDispay,setBgDisplay]= useState(0)
    let pageTitles= ["Attendance","Timetable","Subjects","Class Chats"]
    let pageLinks=["class-attendance","class-timetable","subjects","chatSystem"]
    let backgroundImages= [["https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/f9/cb/bc/67/ab/v1_E10/E109ZUF3.jpg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=00533e572eb04eeba13319c4088af85ca7fdb2c9e366d7a8aec181b5e483be2c",
                            "https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/ed/71/9d/2d/7c/v1_E10/E103AY5W.jpg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=f3d9ad4604d8f17e06e495aa082e922f5695a5c44bbf89d4b2eb45ac30c85a29",
                            "https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/a9/77/27/11/6d/v1_E10/E105TJH5.jpeg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=9e47d3c24a2667013dcd02a7325f7c0baf11409ec89703c52b44a8a77cd449f8"
                            ],
                            // second page title backgrounds
                            ["https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/54/4b/ab/a0/bd/v1_E10/E101CV2M.jpg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=986920151a3e56d2b8cac90e0870a5dad79f1acf3f8fc7c81d29dfd46f6abaa1",
                              "https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/92/f0/2a/0c/da/v1_E10/E103I7L1.jpg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=8ae9e1a647427be1ad941877bee098eda1863ee7fc514a8201647fe06f536be8",
                              "https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/0c/d9/e2/f4/9e/v1_E10/E1087TE6.jpg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=f5e4d8ab15e81d4721b147b3744fb89b04ddb8703d1a9e688074e1cac0dc6a4c"
                            ],
                            // third page title backgrounds
                            ["https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/ca/19/0f/0e/9b/v1_E10/E108ZGBD.jpg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=26b5a3841520bce1d7d9708ef6ad47d6baacf4b6e7e6ddeb88f01c1a98cdf702",
                             "https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/ee/43/39/a8/1a/v1_E10/E10DHUQS.jpg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=3dfcdbdccddfd622cbb5275d4f71c0c0d28dcac95f0dd7b84ffb66989ecfbdc8",
                             "https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/05/7f/ce/5e/51/v1_E10/E10DCIPS.jpg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=7e2aa1e75fc0ed0055b74aa8c338146e8efd476834fec3c6203c6ae0fa33d034"
                            ],
                            // Fourth page title background
                            ["https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/85/b7/81/61/ee/v1_E11/E116AJLS.jpg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=67266d938518da8ceceb491de988c3e7dbab1090759850f44da8316bda988caa",
                             "https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/47/b2/6a/dd/34/v1_E10/E1063EZ1.jpg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=9f0e8f3601d97a250f0ae72a3fcc8c9e164abc403d77bd6469eb8e96530db5bc",
                             "https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/ab/48/c4/8c/d9/v1_E10/E104H23S.jpg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=2054f044356087c8f43e1372f4eab296c789840a091128b136f9bc0bbc313a83"
                            ]
                            // all page title backgrounds grouped together 

    ]
    useEffect(()=>{
        setInterval(()=>{
            setBgDisplay((bgDispay+1) % 3)
        },10000)
        // console.log("recquired location is ",location.pathname)
    })
    

    return<>
   

<div className="class-module-root">
  <div className={`${screenData.mobileScreen ? "mobile-class-grid" : "module-grid"} class-navigation` }>
    {
        pageTitles.map((page,index)=>{
            return <ClassNavLink key={index *4545} value={{to:pageLinks[index],title:page,background:backgroundImages[index][0],isBaseRoute}}/>
        })
    }
  </div>

  <div className="outlet-overview">
    <Outlet/>
  </div>
</div>
    </>
}

function ClassNavLink({value}){

    return <>
    { (value.isBaseRoute) ?
        <StyledNavLinkCard to={value.to} value={{background:value.background}} >
            <div className="overlay">
              <h2>{value.title}</h2>
            </div>
            {/* <NavLink to={`/protected/layout/admin`}>Admin</NavLink> */}
        </StyledNavLinkCard>

        :
        <StyledNavLink to={value.to} value={{background:value.background}}>
            <div className="overlay-mobile">
              <div>{value.title}</div>
            </div>
        </StyledNavLink>
        
    }
    </>
}

const StyledNavLinkCard = styled(NavLink)`
  width:100%;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  text-decoration: none;
  color: white;
  height: 200px;
  border-radius: 15px;
  overflow: hidden;
  background:url(${(props)=>{return props.value.background}});
  background-size: cover;
  background-position: center;
  transition: transform 1s ease, box-shadow 0.3s ease;
`

const StyledNavLink = styled(NavLink).attrs(({isActive})=> ({className: isActive ? "active" : ""}))`
  text-decoration: none;
  // font-size:12px;
  color:black;

  &.active{
    color: #0077ff;
    // border-bottom: 2px solid #0077ff;
    font-weight: bold; 
  }
`


export default Class

// https://static.vecteezy.com/system/resources/previews/024/218/671/non_2x/erp-enterprise-resource-planning-system-illustration-with-business-integration-productivity-and-company-enhancement-in-hand-drawn-templates-vector.jpg
// https://wixmp-2c8f906a62709a387faa1da5.wixmp.com/banner-images/a2ad94b0-56cb-4168-9527-adae66ddcc73.png