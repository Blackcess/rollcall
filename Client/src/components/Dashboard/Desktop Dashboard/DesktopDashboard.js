
import "./DesktopDashboard.css" 
import Testing from "../../Testing Purposes/Testing";
import { Outlet, useNavigate,useLocation, NavLink, replace, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios"
import { GiCage } from "react-icons/gi";
import { BiAward } from "react-icons/bi";
import { useAuth } from "../../../Aunthentication/AuthProvider";
import { MdSubject } from "react-icons/md";
import { MdOutlineNavigateNext } from "react-icons/md";
import { indexToSemesterSubjectsTable, indexToSemesterStudentTable } from "../../../utils_functions/index_to_semester_table";
import { createContext } from "react";

const API_BASE_URL = process.env.REACT_APP_API_URL;
export const resultContext = createContext();
function DesktopDashboard(){
     let [userData,setUserData]= useState({})
    let [userSubjects,setUserSubjects] = useState({})
    let [subjectDataFound,setSubjectDataFound]=useState(false)
    let [userDataFound,setUserDataFound]=useState(false)
    const [allSemesters,setAllSemesters]= useState([])
    const [allSemestersFetched,setAllSemestersFetched]= useState(false);
    let [rollNumber,setRollNumber] = useState(null);
    let navigation = useNavigate();
    let location = useLocation();
    const sessionData = useAuth();
    const {index} = useParams();
    useEffect(()=>{

        // console.log("Default Index ",index)
        async function getFromServer(id){
            // const studentTable = indexToSemesterStudentTable(parseInt(index));
            // if(studentTable){
                try {
                    const response=  await axios.get(`${API_BASE_URL}/Student/results/semester?student_id=${sessionData.userData.student_id}&semester=${index}`,{
                    withCredentials:true
                    })
                    if(response.data.length){
                        setUserData(response.data[0])
                        setUserDataFound(true)
                    }
            }    catch (error) {
                console.error("Error Occured:  ",error)
                setUserDataFound(false)
            }
            
        }
        
        async function getSubjects() {
            try {
                const response= await axios.get(`${API_BASE_URL}/Student/subjects?semester=${index}`,{
                    withCredentials:true
                })
               
                
                
                if(response.data.status){
                    setUserSubjects((prev)=>{
                        prev.data= response.data.data;
                        return prev;
                    })
                    setSubjectDataFound(true)
                }
               

            } catch (error) {
                console.log("Error in retrieving subjects",error)
                setSubjectDataFound(false)
            }
            
        }
            async function fetchSemetersList(){
                try {
                    const res = await axios.get(`${API_BASE_URL}/Student/results/list-all-recorded-semesters?roll_number=2305333`,{
                        withCredentials:true
                    })
                    if(res.data.status){
                        setAllSemesters(res.data.data)
                        setAllSemestersFetched(true)
                    }
                } catch (error) {
                    console.error("Error fetching semesters list: ", error);
                }
            }


       
        getSubjects();
        getFromServer(sessionData.userData.roll_number);
        fetchSemetersList();
    },[index])

  

  
  
//    let semesterLinks=["Semester 1","Semester 2","semester 3"];
   
    return <>
        <section className="desktop-dashboard-template">
           <div className="heading-area">
             {/* <h1 className="desktop-dashboard-heading">Dashboard</h1> */}
             {(allSemestersFetched)&&<div className="selection-area">
                {
                    allSemesters.map((sem,my_index)=>(
                        <div key={my_index} onClick={()=>
                        {
                            // setIndex(my_index + 1)
                        }}
                              className="sem-link-2">
                            {/* <NavLink to={`/protected/layout/dashboard/desktop/charts/${index + 1}`}>{sem}</NavLink> */}
                            <NavLink to={`/protected/layout/dashboard/desktop/charts/${my_index + 1}`} className={({isActive})=>{
                             return   (isActive) ? "link-active-1" : "link-inactive-1"
                            }}  >{sem}</NavLink>
                        </div>
                    ))
                }
             </div>}
           </div>
            <div className="desktop-dashboard-main-outlet">
                <div className="dashboard-part-1">
                    <resultContext.Provider value={{userData,userSubjects,index}}>
                    <Outlet/>
                    </resultContext.Provider>
                </div>
                <div className="dashboard-part-2">
                   
                   { (userDataFound && subjectDataFound && index) && <RightSection value={{userData,userSubjects,userDataFound,subjectDataFound,index,rollNumber}}/> }
                    
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

            </div>
            <div className="subject-data">
                <h2 className="dt-subject-namkas">Semester {props.value.index} Subjects</h2>
                {
                    props.value.userSubjects.data.map((row,my_index)=>(
                           <div key={my_index} className="sub-dt" onClick={(event)=>{
                                navigation(`/protected/layout/dashboard/subject/desk?subject=${row.name}&index=${props.value.index}&roll_number=${props.value.rollNumber}&subjectId=${row.id}`,{
                                    replace:true,
                                })
                           }}> <SubjectPathTemplate value={{subject:row.name}}/> </div>
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