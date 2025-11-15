
import "./DesktopDashboard.css" 
import Testing from "../../Testing Purposes/Testing";
import { Outlet, useNavigate,useLocation, NavLink, replace } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios"
import { GiCage } from "react-icons/gi";
import { BiAward } from "react-icons/bi";
import { MdSubject } from "react-icons/md";
import { MdOutlineNavigateNext } from "react-icons/md";
import { indexToSemesterSubjectsTable, indexToSemesterStudentTable } from "../../../utils_functions/index_to_semester_table";

const API_BASE_URL = process.env.REACT_APP_API_URL;
function DesktopDashboard(){
     let [userData,setUserData]= useState({})
    let [userSubjects,setUserSubjects] = useState({})
    let [subjectDataFound,setSubjectDataFound]=useState(false)
    let [userDataFound,setUserDataFound]=useState(false)
    let [index,setIndex] = useState(2);
    let [rollNumber,setRollNumber] = useState(null);
    let navigation = useNavigate();
    let location = useLocation();


    useEffect(()=>{
        async function getFromServer(roll_number){
            const studentTable = indexToSemesterStudentTable(parseInt(index));
            if(studentTable){
                try {
                    const response=  await axios.get(`${API_BASE_URL}/results?table=${studentTable}&roll_number=${roll_number}`,{
                    withCredentials:true
                    })
                    
                    setUserData((prev)=>{
                    return response.data[0]
                    })
                    if(Object.keys(response.data[0]).length){
                    setUserDataFound(true)
                    }
            }    catch (error) {
                console.log("Error Occured:  ",error)
                setUserDataFound(false)
            }
            }
            else{
                console.log("Errrror",studentTable,index)
            }
            
        }
        const subjectTable= indexToSemesterSubjectsTable(parseInt(index));
        async function getSubjects() {
            if(subjectTable){
            try {
                const response= await axios.get(`${API_BASE_URL}/assets/results/semester/subjects?table=${subjectTable}`,{
                    withCredentials:true
                })
                setRollNumber(response.data.user.roll_number)
                setUserSubjects((prev)=>{
                    prev.data= response.data.results;
                    return prev;
                })
                await getFromServer(response.data.user.roll_number);
                
                if(response.data.results.length){
                    setSubjectDataFound(true)
                }
               

            } catch (error) {
                console.log("Error in retrieving subjects",error)
                setSubjectDataFound(false)
            }
            }
            
        }
       
        getSubjects();
            
            
        
    },[index])

  

  
  
   let semesterLinks=["Semester 1","Semester 2","semester 3"];
   
    return <>
        <section className="desktop-dashboard-template">
           <div className="heading-area">
             <h1 className="desktop-dashboard-heading">Dashboard</h1>
             <div className="selection-area">
                {
                    semesterLinks.map((sem,my_index)=>(
                        <div key={my_index} onClick={()=>{setIndex(my_index + 1)}}  className="sem-link-2">
                            {/* <NavLink to={`/protected/layout/dashboard/desktop/charts/${index + 1}`}>{sem}</NavLink> */}
                            <NavLink to={`/protected/layout/dashboard/desktop/charts/${my_index + 1}`} className={({isActive})=>{
                             return   (isActive) ? "link-active-1" : "link-inactive-1"
                            }}  >{sem}</NavLink>
                        </div>
                    ))
                }
             </div>
           </div>
            <div className="desktop-dashboard-main-outlet">
                <div className="dashboard-part-1">
                    <Outlet/>
                </div>
                <div className="dashboard-part-2">
                   
                   { (userDataFound && subjectDataFound && index) && <RightSection value={{userData,userSubjects,userDataFound,subjectDataFound,index,rollNumber}}/> }
                   {/* <RightSection value={{userData,userSubjects,userDataFound,subjectDataFound,index}}/> */}
                    
                </div>
            </div>
        </section>
    </>
}


function RightSection(props){
   let navigation = useNavigate()
    return<>
        <section className="right-section-template">
            <div className="sgpa-data">
                  <SGPATracker value={{title:`Semester ${props.value.index} SGPA`,value:props.value.userData.SGPA}} type={{isSGPA:true}}/>
                  {/* <SGPATracker value={{title:`Semester ${props.value.index} Status`,value:props.value.userData.result_status}} type={{isSGPA:false}}/> */}
                  {/* <SGPATracker/> */}

            </div>
            <div className="subject-data">
                <h2 className="dt-subject-namkas">Semester {props.value.index} Subjects</h2>
                {
                    props.value.userSubjects.data.map((row,my_index)=>(
                           <div key={my_index} className="sub-dt" onClick={(event)=>{
                                navigation(`/protected/layout/dashboard/subject/desk?subject=${row.subject_name}&index=${props.value.index}&roll_number=${props.value.rollNumber}`,{
                                    replace:true,
                                })
                           }}> <SubjectPathTemplate value={{subject:row.subject_name}}/> </div>
                    ))
                    
                }
            </div>
        </section>
    </>
}

function SGPATracker(props){

    let [isSGPA,setIsSGPA] = useState(true)

    useEffect(()=>{
        let doc = document.querySelector(".dt-sgpa-details")
        // let doc2 = document.querySelector(".get-more-link-sgpa")
        if(props.type.isSGPA){
            doc.style.color="green";
            
        }
        else{
            doc.style.color="black"
            
        }
    })

    return <>
    <section className="sgpa-tracker-desktop-template">
        <div className="sgpa-dt-heading">
            <div className="dt-sgpa-title">
                <span className="dt-sgppa-icon"><GiCage /></span>
                <h2>{props.value.title}</h2>
            </div>
            {/* <div className="dt-sgpa-added"><BiAward /></div> */}
        </div>
        <div className="dt-sgpa-details">{props.value.value}</div>
        <div className="get-more-link-sgpa">view more sgpa details</div>
    </section>
    </>
}


function SubjectPathTemplate(props){
    return<>
    <section className="subject-path-template">
        <div className="subject-path-1">
            <div className="s-p-sub-path-a">
                <MdSubject />
            </div>
            <div className="s-p-sub-path-b">{props.value.subject}</div>
        </div>
        <div className="subject-path-2">
            <MdOutlineNavigateNext/>
        </div>
    </section>
    
    </>
}
export default DesktopDashboard;