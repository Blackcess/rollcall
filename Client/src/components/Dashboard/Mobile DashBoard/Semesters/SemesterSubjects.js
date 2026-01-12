 import "./SemesterSubjects.css"
 import { useParams,useLocation, data } from "react-router-dom"
 import { grade_value,reverseGrade_value } from "../../../../utils_functions/grade_to_value_transformation"
 import { indexToSemesterSubjectsTable , indexToSemesterStudentTable } from "../../../../utils_functions/index_to_semester_table"
 import { translateName,reverseTranslateName } from "../../../../utils_functions/subject_name_translation"
import { useEffect,useState } from "react"
import axios from "axios"
import { useAuth } from "../../../../Aunthentication/AuthProvider"

const API_BASE_URL = process.env.REACT_APP_API_URL;
 
 function SemesterSubjects(){
      let [userData,setUserData]= useState({})
      let [userSubjects,setUserSubjects] = useState({})
      let [subjectDataFound,setSubjectDataFound]=useState(false)
      let [subjectAggregates,setSubjectAggregates] = useState({})
      let [aggregatesDone,setAggreegatesDone]=useState(false)
      let [userDataFound,setUserDataFound]=useState(false)
      let [interstingData,setInterstingData]= useState({});
      let [dataReady,setDataReady]=useState(false)
      let [done,setDone]=useState(false)
      
      const location = useLocation();
      const queryParams = new URLSearchParams(location.search)
      const mySub = queryParams.get('subject');
      const index = queryParams.get(`index`)
      const rollNumber = queryParams.get(`roll_number`)
      const subjectId= queryParams.get(`subjectId`)
      const sessionData = useAuth(); 

    // -------------------------->
   
      useEffect(()=>{
        // console.log("Index Data",index)
        async function getFromServer(id){

            try {
                const response=  await axios.get(`${API_BASE_URL}/Student/results/semester?student_id=${sessionData.userData.student_id}&semester=${index}`,{
                        withCredentials:true
                    })
                                
                    if(response.data.length){
                        setUserData((prev)=>{
                            return response.data[0]
                        })
                        setUserDataFound(true)
                    }
            }catch (error) {
                console.log("Error Occured:  ",error)
                setUserDataFound(false)
            }
            
        }
        const subjectTable= indexToSemesterSubjectsTable(parseInt(index));
        async function getSubjects(index) {
            if(subjectTable){
            try {
                 const response = await axios.get(`${API_BASE_URL}/Student/subjects?semester=${index}`,{
                    withCredentials:true
                })
                setUserSubjects((prev)=>{
                    prev.data= response.data.data
                    return prev;
                })
                
                if(response.data.data.length){
                    setSubjectDataFound(true)
                }

            } catch (error) {
                console.log("Error in retrieving subjects",error)
                setSubjectDataFound(false)
            }
            }
            
        }
       
        async function getAggregateData(){
            try {
                const response = await axios.get(`${API_BASE_URL}/Student/results/subjectResults/aggregation?subjectId=${subjectId}`,{
                    withCredentials:true
                })
                if(response.data.status){
                    setSubjectAggregates(response.data.data);
                    setAggreegatesDone(true);
                }
            } catch (error) {
                console.log("Error in retrieving aggregate data",error)
                setAggreegatesDone(false);
            }
        }
       
        getFromServer(rollNumber);
        getSubjects();
        getAggregateData();
        
    },[index])

    useEffect(()=>{
       if(userDataFound){
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

            {aggregatesDone && <div className="detailed-sub-res-class">
                <DetailedSubStats_full_class value={{data:subjectAggregates}}/>
            </div>}

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
    let values = [props.value.data.passed,props.value.data.failed]
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