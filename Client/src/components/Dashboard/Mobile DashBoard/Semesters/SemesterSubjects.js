 import "./SemesterSubjects.css"
 import { useParams,useLocation, data } from "react-router-dom"
 import { grade_value,reverseGrade_value } from "../../../../utils_functions/grade_to_value_transformation"
 import { indexToSemesterSubjectsTable , indexToSemesterStudentTable } from "../../../../utils_functions/index_to_semester_table"
 import { translateName,reverseTranslateName } from "../../../../utils_functions/subject_name_translation"
import { useEffect,useState } from "react"
import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_URL;
 
 function SemesterSubjects(){
      let [userData,setUserData]= useState({})
      let [userSubjects,setUserSubjects] = useState({})
      let [subjectDataFound,setSubjectDataFound]=useState(false)
      let [passed,setPassed]=useState(0)
      let [failed,setFailed]=useState(0)
      let [userDataFound,setUserDataFound]=useState(false)
      let [interstingData,setInterstingData]= useState({});
      let [dataReady,setDataReady]=useState(false)
      let [done,setDone]=useState(false)
      
      const location = useLocation();
      const queryParams = new URLSearchParams(location.search)
      const mySub = queryParams.get('subject');
      const index = queryParams.get(`index`)
      const rollNumber = queryParams.get(`roll_number`)

    // -------------------------->
    useEffect(()=>{
        console.log("Roll  Number ",rollNumber)
    })
      useEffect(()=>{
        // console.log("Index Data",index)
        async function getFromServer(rollNumber){
            const studentTable = indexToSemesterStudentTable(parseInt(index));
            if(studentTable){
                try {
                    const response=  await axios.get(`${API_BASE_URL}/results?table=${studentTable}&roll_number=${rollNumber}`,{
                    withCredentials:true
                    })
                    // console.log(response)
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
        async function getSubjects(index) {
            if(subjectTable){
            try {
                const response= await axios.get(`${API_BASE_URL}/results/semester/subjects?table=${subjectTable}`,{
                    withCredentials:true
                })
                setUserSubjects((prev)=>{
                    prev.data= response.data
                    return prev;
                })
                
                if(response.data.length){
                    setSubjectDataFound(true)
                }

            } catch (error) {
                console.log("Error in retrieving subjects",error)
                setSubjectDataFound(false)
            }
            }
            
        }

        async function getFailed(mySub){
            const studentTable=indexToSemesterStudentTable(parseInt(index))
            try {
             let my_result=   await axios.get(`${API_BASE_URL}/result/subject/failed?subject=${mySub}&view=${studentTable}`);
             setFailed(my_result.data.data[Object.keys(my_result.data.data)[0]])
            } catch (error) {
                console.log(error)
            }
        }
        async function getPassed(mySub){
            const studentTable=indexToSemesterStudentTable(parseInt(index))
            try {
             let my_result=   await axios.get(`${API_BASE_URL}/result/subject/passed?subject=${mySub}&view=${studentTable}`);
             setPassed(my_result.data.data[Object.keys(my_result.data.data)[0]])
            } catch (error) {
                console.log(error)
            }
        }
       
        getFailed(mySub)
        getPassed(mySub)
        console.log("Roll Number before..",rollNumber)
        getFromServer(rollNumber);
        getSubjects();
        
    },[index])

    useEffect(()=>{
       if(Object.keys(userData).length){
         let temp = userData[mySub].split(",");
         setInterstingData((prev)=>{
            const data = {...prev,
                subject:mySub,
                grade:temp[0],
                qualitaive_meaning:temp[1],
                status:temp[2]
            }
            return data
         })
       }
    },[userDataFound])
   

 
    
     
  
    return <>
    <section className="mobile-subject-section">
        <h2>Subject Analysis</h2>
        <div className="subject-description-1">
            <div className="sub-status-fency">
                <ShowStatus value={{subject:mySub,interstingData}}/>
            </div>

           <div className="detaile-sub_res-personal">
                { (Object.keys(interstingData).length) ? <DetailedSubStats_full value={{myData:interstingData}}/> : <p>Loading</p>} 
            </div>
            
            <div className="detailed-sub-res-class">
                <DetailedSubStats_full_class value={{passed,failed}}/>
            </div>

        </div>

    </section>
    </>
 }

 function ShowStatus(props){
    useEffect(()=>{
        const doc = document.querySelector(".sub-stat");
        if(props.value.interstingData.status==="pass"){
            doc.style.color="green"
        }
        else{
            doc.style.color="red"
        }
    })

    return <>
    <section className="subject-status-show">
        <h3 className="sub-stats-heading">{props.value.subject} Status</h3>
        <div className="sub-stat">
            <h2>{props.value.interstingData.status}</h2>
        </div>
    </section>
    </>
 }

 function DetailedSubStats_full(props){
    let titles=["Subject","Grade","Qualitative Meaning","Status"]

    return <>
    <section className="detailed-status-template">
        <div className="personal-stats-sub-res">
            <h3>Personal Perfomance</h3>
            <div className="personal-data-stat-sub">
                {
                     Object.keys(props.value.myData).map((key,index)=>(
                        <SubResult_Helper value={{value:props.value.myData[key],title:titles[index]}} key={index}/>
                    ))
                }
            </div>
        </div>
    </section>
    </>
 }

 function SubResult_Helper(props){
    
    useEffect(()=>{
        const doc = document.querySelectorAll(".sub-res-value")
        if(props.type && props.type === "isDigit"){
            for(let i=0;i<doc.length;i++){
                doc[i].style.color="green"
            } 
          
        }
    })
    return<>
    
    <section className="sub-res-helper">
        <div className="sub-res-title">{props.value.title}</div>
        <div className="sub-res-value">{props.value.value}</div>
    </section>
    </>
 }
 function DetailedSubStats_full_class(props){
    let titles=["Passed Students","Failed Students"];
    let values = [props.value.passed,props.value.failed]
    // console.log(values)
    return <>
    <section className="detailed-status-template">
        <div className="personal-stats-sub-res">
            <h3>Overal Class Perfomance</h3>
            <div className="personal-data-stat-sub">
                {
                     titles.map((key,index)=>(
                        <SubResult_Helper value={{value:values[index],title:titles[index]}} key={index} type="isDigit"/>
                    ))
                }
            </div>
        </div>
    </section>
    </>
 }
 export default SemesterSubjects