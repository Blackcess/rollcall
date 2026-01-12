import "./ActualSemester.css"
 import { grade_value,reverseGrade_value } from "../../../../utils_functions/grade_to_value_transformation"
import axios from "axios"
import { MdSubject } from "react-icons/md";
import { MdOutlineNavigateNext } from "react-icons/md";
import { useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom"
import { useAuth } from "../../../../Aunthentication/AuthProvider";
import { indexToSemesterSubjectsTable , indexToSemesterStudentTable } from "../../../../utils_functions/index_to_semester_table"
import Testing from "../../../Testing Purposes/Testing"
import ShimmerLoader from "../../../Util Components/ShimmerLoader/ShimmerLoader";
import { translateName,reverseTranslateName } from "../../../../utils_functions/subject_name_translation"
    import {Line,Doughnut, Bar} from "react-chartjs-2"
    import {
      Chart as ChartJS,
      CategoryScale,
      LinearScale,
      PointElement,     // 👈 Fix: add this
      LineElement,      // 👈 Also needed for line charts
      Title,
      Tooltip,
      Legend,
      ArcElement,
      BarElement  
    } from 'chart.js';
    
    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      ArcElement,
      BarElement,
      Title,
      Tooltip,
      Legend
    );
   
    const API_BASE_URL = process.env.REACT_APP_API_URL;

function ActualSemesterData(){
    let [userData,setUserData]= useState({})
    let [userSubjects,setUserSubjects] = useState({})
    let [subjectDataFound,setSubjectDataFound]=useState(false)
    let [userDataFound,setUserDataFound]=useState(false)
    let [startRender,setStartRender] = useState(true)
    let [rollNumber,setRollNumber] = useState(null);
    const sessionData = useAuth();
    
    const {index} = useParams();
    
    useEffect(()=>{
        // console.log("Index Data",index)
        let user={};
        async function getFromServer(id){ 
            
            // const studentTable = indexToSemesterStudentTable(parseInt(index));
            // if(studentTable && id){
                try {
                    const response=  await axios.get(`${API_BASE_URL}/Student/results/semester?student_id=${sessionData.userData.student_id}&semester=${index}`,{
                    withCredentials:true
                    })
                    // console.log("My response from new logic is ",response)
                    
                    if(response.data.length){
                        setUserData((prev)=>{
                            return response.data[0]
                        })
                        setUserDataFound(true)
                    }
            }    catch (error) {
                console.log("Error Occured:  ",error)
                setUserDataFound(false)
            }
            // }
            // else{
            //     console.log("Errrror",rollNumber)
            // }
            

            // --------------------------------------
           



        }
        const subjectTable= indexToSemesterSubjectsTable(parseInt(index));
        async function getSubjects() {
            // if(subjectTable){
            // try {
            //     const response= await axios.get(`${API_BASE_URL}/assets/results/semester/subjects?sem=${index}`,{
            //         withCredentials:true
            //     })
            //     user.data= response.data;
            //     setRollNumber(response.data.user.roll_number);  
            //     setUserSubjects((prev)=>{
            //         prev.data= response.data.results;
            //         return prev;
            //     })
            //     console.log("My Legacy subject response is ",response.data)
                
            //     if(response.data.results.length){
            //         setSubjectDataFound(true)
            //     }
            //     //  await getFromServer(response.data.user.roll_number);

            // } catch (error) {
            //     console.log("Error in retrieving subjects",error)
            //     setSubjectDataFound(false)
            // }
            // }
            try {
                const response = await axios.get(`${API_BASE_URL}/Student/subjects?semester=${index}`,{
                    withCredentials:true
                })
                if(response.data.status){
                    user.data= response.data.data;
                    setUserSubjects((prev)=>{
                        prev.data= response.data.data;
                        return prev;
                    })
                    setSubjectDataFound(true)
                    // console.log("My New subject response is ",response.data)
                    if(sessionData && sessionData.userData){
                        setRollNumber(sessionData.userData.roll_number);
                    }
                }
            } catch (error) {
                console.error("Error in retrieving subjects",error)
                setSubjectDataFound(false)
            }
            
        }
       
            getSubjects();
            getFromServer(sessionData.userData.roll_number);
            
        
    },[index])

    // useEffect(()=>{
    //     console.log("UsertData", userData)
    // })

    
    
    return<>
       
       { (userDataFound) ? <section className="actual-semester-data-template">
        <div className="subjects-doughnut-graph">
             <SemestersGradesDoughnut value={{user:userData,subjects:userSubjects}} type="doughnut"/>
        </div>     
             <div className="sgpa-area">
                <SGPAStatus value={{title:"Total SGPA",value:userData.SGPA}} />
                <SGPAStatus value={{title:"Status",value:userData.result_status}}/>
             </div>
             
             <div className="subjects-bar-graph"> 
                 <SemestersGradesDoughnut value={{user:userData,subjects:userSubjects}} type="bar"/>
             </div>
            {(subjectDataFound)&& <div className="dashboard-select-subject">
                <h4 className="subject-header">Subjects</h4>
                <div className="actual-subs">
                    {
                        userSubjects.data.map((row,myIndex)=>(
                        // (row.name !== "Mentoring_And_Proffesional_Development") && 
                            <NavLink key={myIndex} to={`/protected/layout/dashboard/subject?subject=${row.name}&index=${index}&roll_number=${rollNumber}&subjectId=${row.id}`} className="mobile-sub-link">
                                 <SubjectPathTemplate value={{subject:row.name}}/>
                             </NavLink> 
                        ))
                    }
                   
                </div>
               
             </div>
                }
       </section>
        :
        <ShimmerLoader/>
}
       
    </>
    }

function SemestersGradesDoughnut(props){
    const [loaded,setLoaded]= useState(false)
    const [chart,setChart] = useState("Doughnut")

    useEffect(()=>{
        if(props.type==="bar"){
            setChart("bar")
        }
        if(props.type==="doughnut"){
            setChart("doughnut")
        }
    })

    // Utility function to generate random hex color
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    function resolveDatasets(){
        // console.log("Whats your deal ", props.value.user[WorkShop])
        if(props.value.subjects.data ){
            const temp={};
            const gradeValues=[];
            const FailedAttempts=[];
            props.value.subjects.data.map((row)=>{
                if(props.value.user[row.name]){
                     let gradeArray = props.value.user[row.name].split(",");
                     temp.gradeSymbol= gradeArray[0]
                     temp.qualitative_meaning= gradeArray[1]
                     temp.gradeStatus= gradeArray[2]
                     let gradeValue = grade_value(temp.gradeSymbol);
                     gradeValues.push(gradeValue)
                }
        })
        // console.log("Grade values are",gradeValues)
        return gradeValues;
        }
        
       
    }
    

    useEffect(()=>{
        // console.log(props)
        if(props.value.subjects.data){
            setLoaded(true)
        }
        else{
            setLoaded(false)
        }
    })
    
    return <>
  { (loaded) && 
    <section className="dougnut-template"> 
  { (chart === "doughnut") && <Doughnut data={{
        // labels:props.value.subjects.data.map((row)=>(translateName(row.subject_name))),
        labels:props.value.subjects.data.map((row)=>(row.name)),
        datasets:[
            {
                label:"subject grades",
                data:resolveDatasets(),
                backgroundColor:props.value.subjects.data.map((row)=>(getRandomColor())),
                borderRadius:"10px"
            }

        ]
    }}
    
     options={
        {
            responsive:true,
            maintainAspectRatio:false,
            plugins:{
                legend:{
                    position: 'right', // <-- moves the legend to the right
                    labels: {
                    boxWidth: 20,
                    padding: 15,
                    }
                },
                tooltip:{
                    callbacks:{
                        title:function (tootipItems){
                            const label = tootipItems[0].label
                            // return reverseTranslateName(label)
                            return label;
                        },
                        label: function(tooltipItem) {
                                    // const datasetLabel = tooltipItem.dataset.label || '';
                                    // const value = tooltipItem.formattedValue;
                                    const datasetLabel = tooltipItem.dataset || "";
                                    const actualLabel= reverseTranslateName(datasetLabel);
                                    const grade= reverseGrade_value(parseInt(tooltipItem.formattedValue))
                                    return `Grade: ${grade}`;
                                }
                }
            }
        } 
    }
    }
    />
    }

    {
        (chart === "bar")&& <Bar data={{
        // labels:props.value.subjects.data.map((row)=>(translateName(row.subject_name))),
        labels:props.value.subjects.data.map((row)=>((row.name))),
        datasets:[
            {
                label:"subject grades",
                data:resolveDatasets(),
                backgroundColor:props.value.subjects.data.map((row)=>(getRandomColor())),
                borderRadius:"10px"
            }

        ]
    }}
    
     options={
        {
            responsive:true,
            maintainAspectRatio:false,
            plugins:{
                legend:{
                    position: 'top', // <-- moves the legend to the right
                    labels: {
                    boxWidth: 20,
                    padding: 15,
                    }
                },
                tooltip:{
                    callbacks:{
                        title:function (tootipItems){
                            const label = tootipItems[0].label
                            return reverseTranslateName(label)
                        },
                         label: function(tooltipItem) {
                                    // const datasetLabel = tooltipItem.dataset.label || '';
                                    // const value = tooltipItem.formattedValue;
                                    const datasetLabel = tooltipItem.dataset || "";
                                    const actualLabel= reverseTranslateName(datasetLabel);
                                    const grade= reverseGrade_value(parseInt(tooltipItem.formattedValue))
                                    return `Grade: ${grade}`;
                                }
                    },
                    
                }
            }
        } 
    }

    height={300}
    />

    }
    </section>
}
    
    </>
}

function SGPAStatus(props){

    return<>
    <section className="sgpa-helper-template">
        <h4 className="sgpa-title">{props.value.title}</h4>
        <div className="sgpa-value">
            {props.value.value}
        </div>
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
export default ActualSemesterData