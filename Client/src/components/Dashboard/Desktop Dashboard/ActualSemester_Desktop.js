import "./ActualSemester_Desktop.css"
import { grade_value, reverseGrade_value } from "../../../utils_functions/grade_to_value_transformation";
import axios from "axios"
import { MdSubject } from "react-icons/md";
import { useAuth } from "../../../Aunthentication/AuthProvider";
import { MdOutlineNavigateNext } from "react-icons/md";
import { use, useContext, useEffect, useState } from "react"
import { useParams,useLocation } from "react-router-dom"
import ShimmerLoader from "../../Util Components/ShimmerLoader/ShimmerLoader";
import { indexToSemesterSubjectsTable, indexToSemesterStudentTable } from "../../../utils_functions/index_to_semester_table";
import Testing from "../../Testing Purposes/Testing";
import { translateName, reverseTranslateName } from "../../../utils_functions/subject_name_translation";
    import {Line,Doughnut, Bar} from "react-chartjs-2"
    import { resultContext } from "./DesktopDashboard";
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

function ActualSemesterData_Desktop(){
    let [userData,setUserData]= useState({})
    let [userSubjects,setUserSubjects] = useState({})
    let [subjectDataFound,setSubjectDataFound]=useState(false)
    let [userDataFound,setUserDataFound]=useState(false)
    let [rollNumber,setRollNumber] = useState(null);
    let [startRender,setStartRender] = useState(true)
    let location= useLocation();
    const sessionData = useAuth();
    const {index} = useParams();
    const resultsGlobal = useContext(resultContext);

    
    
    useEffect(()=>{
        // console.log("Index Data",index)
        async function getFromServer(id){
              try {
                    const response=  await axios.get(`${API_BASE_URL}/Student/results/semester?roll_number=${id}&semester=${index}`,{
                        withCredentials:true
                    })
                    if(response.data.length){
                        setUserData(response.data[0])
                        setUserDataFound(true)
                        console.log("My Results from server ",response.data[0])
                    }
                }catch (error) {
                    console.error("Error Occured:  ",error)
                    setUserDataFound(false)
                }
        }
        // const subjectTable= indexToSemesterSubjectsTable(parseInt(index));
        // async function getSubjects() {
        //     if(subjectTable){
        //     try {
        //         const response= await axios.get(`${API_BASE_URL}/assets/results/semester/subjects?table=${subjectTable}`,{
        //             withCredentials:true
        //         })
        //         //  console.log("Desktop data",response.data)
        //         setRollNumber(response.data.user.roll_number)
        //         setUserSubjects((prev)=>{
        //             prev.data= response.data.results;
        //             return prev;
        //         })
        //         await getFromServer(response.data.user.roll_number);
                
        //         if(response.data.results.length){
        //             setSubjectDataFound(true)
        //         }
        //     } catch (error) {
        //         console.log("Error in retrieving subjects",error)
        //         setSubjectDataFound(false)
        //     }
        //     }
            
        // }
            //  getSubjects();
            getFromServer(sessionData.userData.roll_number);
            if(resultsGlobal && resultsGlobal.userSubjects && resultsGlobal.userSubjects.data){
                setUserSubjects(resultsGlobal.userSubjects)
                setSubjectDataFound(true)

            }
        
    },[index])
    
    return<>
       { (userDataFound) ? <section className="actual-desktop-semester-data-template">
        <div className="desktop-bar-data">
            <div className="desktop-bar-heading">
                <div className="desktop-bar-heading-1">
                    <span className="bar-data-icon"></span>
                    <h2 className="bar-data"> Semester {index} Bar Chart</h2>
                </div>
            </div>
            <div className="desktop-actual-bar">
                <div className="eiujhd">
                    <SemestersGradesDoughnut_Desktop value={{user:userData,subjects:userSubjects}} type="bar"/>
                </div>
                
            </div>
             
        </div>     
        <div className="desktop-bar-data">
            <div className="desktop-bar-heading">
                <div className="desktop-bar-heading-1">
                    <span className="bar-data-icon"></span>
                    <h2 className="bar-data"> Semester {index} Doughnut Chart</h2>
                </div>
            </div>
            <div className="desktop-actual-bar-doughnut">
                <div className="eiujhd">
                    <SemestersGradesDoughnut_Desktop value={{user:userData,subjects:userSubjects}} type="doughnut"/>
                </div>
                
            </div>
             
        </div>     
           
             
           
       </section>
       :
       <ShimmerLoader/>}
    </>
}












function SemestersGradesDoughnut_Desktop(props){
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
        labels:props.value.subjects.data.map((row)=>(row.name)),
        datasets:[
            {
                label:"subject grades",
                data:resolveDatasets(),
                backgroundColor:props.value.subjects.data.map((row)=>(getRandomColor())),
                // borderRadius:20
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
                            return label
                        },
                        label: function(tooltipItem) {
                                    // const datasetLabel = tooltipItem.dataset.label || '';
                                    // const value = tooltipItem.formattedValue;
                                    const datasetLabel = tooltipItem.dataset || "";
                                    // const actualLabel= reverseTranslateName(datasetLabel);
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
        labels:props.value.subjects.data.map((row)=>(row.name)),
        datasets:[
            {
                label:"subject grades",
                data:resolveDatasets(),
                backgroundColor:props.value.subjects.data.map((row)=>(getRandomColor())),
                borderRadius:20,
                // barThickness:15,
                borderSkipped:false,
                categoryPercentage:0.2,
                barPercentage:0.7,
            }

        ]
    }}
    
     options={
        {
            responsive:true,
            maintainAspectRatio:false,
            scales: {
                y: {
                    min: 0,
                    max: 10,
                    ticks: {
                        stepSize: 1,
                        callback: function (value) {
                            return reverseGrade_value(value) || value;
                            }
                        },
                    title: {
                        display: true,
                        text: 'Grade'
                    }
                }
            },
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
                            return label
                        },
                         label: function(tooltipItem) {
                                    // const datasetLabel = tooltipItem.dataset.label || '';
                                    // const value = tooltipItem.formattedValue;
                                    const datasetLabel = tooltipItem.dataset || "";
                                    // const actualLabel= reverseTranslateName(datasetLabel);
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


export default ActualSemesterData_Desktop

