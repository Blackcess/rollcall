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
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../../../Aunthentication/AuthProvider";
import { useEffect,useState } from "react";
import { indexToSemesterStudentTable, indexToSemesterSubjectsTable } from "../../../../../utils_functions/index_to_semester_table";
import axios from "axios";
import { translateName,reverseTranslateName } from "../../../../../utils_functions/subject_name_translation";
import { grade_value,reverseGrade_value } from "../../../../../utils_functions/grade_to_value_transformation";
import ShimmerLoader from "../../../../Util Components/ShimmerLoader/ShimmerLoader";
const API_BASE_URL = process.env.REACT_APP_API_URL;
    
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



    function CompareOnSemester(){

        const {search} = useLocation();
        let queryParams = new URLSearchParams(search);
        const compRollNumber = queryParams.get("roll_number");
        const whichSemester = queryParams.get("semester")
        let sessionData = useAuth();
         let [player2Data,setPlayer2Data] = useState({});
         let [player2Ready,setPlayer2Ready] = useState(false);
         let [userSubjects,setUserSubjects] = useState({});
         let [subjectDataFound,setSubjectDataFound] = useState(false)
        useEffect(()=>{
            sessionData.myResults();
            allSemesterData();

        },[search])

         const fetchSemesterData = async (id,sem)=>{
        let table = indexToSemesterStudentTable(sem);
        if(table &&  id){
            try {
                const result =  await axios.get(`${API_BASE_URL}/results?table=${table}&roll_number=${id}`);
                return result.data[0];  //object
            } catch (error) {
                console.error("Error",error)
            }
        }
        else{
            // console.log("Sorry Seems like your table is wrong",table,id)
        }
    }
     async  function allSemesterData(){
        let temp={};
        for(let i=1;i<=3;i++){
            const myData= await fetchSemesterData(compRollNumber,i);
            // console.log("Which Data is this...",myData)
            temp[`semester_${i}`]= {...myData};
        }
        setPlayer2Data((prev)=>{
            let data = {...prev};
            data[`all_semester_results`]={...temp};
            return data;
        })
        setPlayer2Ready(true)
    }
    useEffect(()=>{
            const subjectTable= indexToSemesterSubjectsTable(parseInt(whichSemester));
            async function getSubjects() {
            if(subjectTable){
            try {
                const response= await axios.get(`${API_BASE_URL}/assets/results/semester/subjects?table=${subjectTable}`,{
                    withCredentials:true
                })
                if(response.data.status){
                    console.log("Subject data response is ",response.data)
                }
                setUserSubjects((prev)=>{
                    prev.data= response.data.results;
                    return prev;
                })
                // console.log("My subject data is here...",response.data.results)
                
                if(response.data.results.length){
                    setSubjectDataFound(true)
                }
            } catch (error) {
                console.log("Error in retrieving subjects",error)
                setSubjectDataFound(false)
            }
            }
            
        }
            getSubjects()
        },[whichSemester,search])
    
     
    


        return <>
        <section className="compare-grade-template">
            {
                (sessionData.userData.all_semester_results && subjectDataFound && player2Ready)?<MyBarChart value={{user:sessionData.userData.all_semester_results[`semester_${whichSemester}`],subjects:userSubjects,user2:player2Data.all_semester_results,semester:whichSemester}}/>:<ShimmerLoader/>
            }
        </section>
        
        </>
    }


    export default CompareOnSemester

    function MyBarChart(props){

        const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
        };

        function resolveDatasets(myUser){
        // console.log("Whats your deal ", props.value.user[WorkShop])
        if(props.value.subjects.data ){
            const temp={};
            const gradeValues=[];
            const FailedAttempts=[];
            console.log(props.value.user2)
            props.value.subjects.data.map((row)=>{
                if(myUser[row.subject_name]){
                     let gradeArray = myUser[row.subject_name].split(",");
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

         


        return <>
        <section>
            <Bar data={{
                    labels:props.value.subjects.data.map((row)=>(translateName(row.subject_name))),
                    datasets:[
                        {
                            label:"subject grades",
                            data:resolveDatasets(props.value.user),
                            // backgroundColor:props.value.subjects.data.map((row)=>(getRandomColor())),
                            backgroundColor:"green",
                            borderRadius:"10px"
                        },
                        {
                            label:"subject grades",
                            data:resolveDatasets(props.value.user2[`semester_${props.value.semester}`]),
                            // backgroundColor:props.value.subjects.data.map((row)=>(getRandomColor())),
                            backgroundColor:"red",
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


        </section>
        </>
    }