import './SemesterSubjectDesktop.css';
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import  {Pie} from 'react-chartjs-2';
import { useLocation, NavLink } from 'react-router-dom';    
import axios from 'axios';
import { indexToSemesterSubjectsTable,indexToSemesterStudentTable } from '../../../utils_functions/index_to_semester_table';        
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../Aunthentication/AuthProvider';

const API_BASE_URL = process.env.REACT_APP_API_URL;

ChartJS.register(ArcElement, Tooltip, Legend);
function SemesterSubjectsDesktop(props) {
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
          const roll_number = queryParams.get(`roll_number`)
          const subjectId= queryParams.get(`subjectId`)
          let sessionData = useAuth()

        
        //  ------------------------------->
        
         useEffect(()=>{
        // console.log("Index Data",index)
        async function getFromServer(id){
              try {
                const response=  await axios.get(`${API_BASE_URL}/Student/results/semester?student_id=${sessionData.userData.student_id}&semester=${index}`,{
                    withCredentials:true
                })
                if(response.data.length){
                    setUserData(response.data[0])
                    setUserDataFound(true)
                }
            }catch (error) {
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
                        prev.data= response.data.data
                        return prev;
                    })
                    setSubjectDataFound(true)
                }

            } catch (error) {
                console.log("Error in retrieving subjects",error)
                setSubjectDataFound(false)
            }
            
        }

           
        async function getAggregateData(){
            try {
                const response = await axios.get(`${API_BASE_URL}/Student/results/subjectResults/aggregation?subjectId=${subjectId}`,{
                    withCredentials:true
                })
                if(response.data.status){
                    console.log("Agrregate data ",response.data.data)
                    setSubjectAggregates(response.data.data);
                    setAggreegatesDone(true);
                }
            } catch (error) {
                console.log("Error in retrieving aggregate data",error)
                setAggreegatesDone(false);
            }
        }

        getSubjects();
        getFromServer(sessionData.userData.roll_number);
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
   

    let  titles=["Total Students","Passed Students","Failed Students","Result Status"];
    let values=[subjectAggregates.total_students,subjectAggregates.passed,subjectAggregates.failed, interstingData.status];




    return (
        <>
        <section className='desktop-subject-section-temptate'>
            <h2>Subject Analysis</h2>
            <div className='desktop-subject-analysis-status'>
               {
                titles.map((title,index)=>(
                    <SubjectAnalysisStatus key={index} value={{title:title,value:values[index]}}/>
                ))
               }
            </div>

            <div className='desktop-subject-analysis-details-1'>
                <SubjectDeatils1 value={{subject:mySub,interstingData,subjectAggregates:subjectAggregates}}/>
            </div>

            <div className='result_status_11'>
                <ResultStatus_dektop/>
                <ResultStatus_dektop/>
            </div>
        </section>
        </>
    );
}

function SubjectAnalysisStatus(props){


    return<>
    <section className='desktop-subject-analysis-status-1'>
        <h3 className='analysis_head_1'>{props.value.title}</h3>
        <div className='analysis_1_value'>{props.value.value}</div>
        <div className='analysis_1_observation'>RollCall Monitor your grades</div>
    </section>
    </>
}

function SubjectDeatils1(props){
    
    let titles=Object.keys(props.value.interstingData);
    useEffect(()=>{  
        // console.log("Titles",titles)
})
    return <>
    <section className='desktop-subject-details-1-1'>
        <div className='sub-stats-desk_1'>
            {
                titles.length && titles.map((keys,index)=>(
                    <SubjectDeatils1_helper key={index} value={{title:keys,values:props.value.interstingData[keys]}}/>
                ))
            }
        </div>
        <div className='sub-stats-desk_2'>
            <SubjectPassPieChart value={{passed:props.value.subjectAggregates.passed,failed:props.value.subjectAggregates.failed}}/>
        </div>
    </section>
    </>
}

function SubjectDeatils1_helper(props){
    

    return<>
    <section className='helper-row-template'>
        <div>{props.value.title}</div>
        <div>{props.value.values}</div>
    </section>
    </>
}
function ResultStatus_dektop(){
    return<>
    <section className='desktop-subject-analysis-status-1'>
        <h3 className='analysis_head_1'>Result Status</h3>
        <div className='analysis_1_value'>Passed</div>
        <div className='analysis_1_observation'>almost most of the students</div>
    </section>
    </>
}


function SubjectPassPieChart(props){

    return<>
    <Pie
        data={{
            labels: ['Passed', 'Failed'],
            datasets: [{
                data: [props.value.passed, props.value.failed],
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384']
            }]
        }}
        width={400}
        height={400}
        options={{
             maintainAspectRatio: false, 
            responsive: true,
            }}
    />
    </>

}
export default SemesterSubjectsDesktop;