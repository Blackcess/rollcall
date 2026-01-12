import "./MySGPA.css"
import { indexToSemesterStudentTable,indexToSemesterSubjectsTable } from "../../../../utils_functions/index_to_semester_table";
import { translateName,reverseTranslateName } from "../../../../utils_functions/subject_name_translation";
import { grade_value,reverseGrade_value } from "../../../../utils_functions/grade_to_value_transformation";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../Aunthentication/AuthProvider";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { MdBorderColor } from "react-icons/md";
import { getSemesterResults } from "../../../Dashboard/API/allStudentGrades.api";
//registration
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);


function MySGPA(){
    let sessionData=useAuth();
    // const [results,setResults] = useState(null)

    useEffect(()=>{
        sessionData.myResults();
    },[])
  useEffect(()=>{
    console.log("User data", sessionData)
  })
  
    return <>
    <section className="my-sgpa-section">
        <h3>MY SGPA</h3>
        <div className="mysgpa-line-something">
           { (sessionData.userData.all_semester_results )&& <SGPA_Chart value={{data:sessionData.userData.all_semester_results.all_semester_results}}/>} 
        </div>
    </section>
    </>
}


function SGPA_Chart(props){
     const data = {
            labels: Object.keys(props.value.data).map((title,index)=>{return title}),
            datasets: [
                            {
                                label: 'SGPA',
                                data:Object.keys(props.value.data).map((title,index)=>{return props.value.data[title].SGPA}),
                                fill: false,
                                // borderColor: 'rgba(75,192,192,1)',
                                borderColor:"green",
                                tension: 0.1,
                            }
                        ]
                    };

    const options = {
            responsive: true,
            maintainAspectRatio:false,
            plugins: {
            legend: { position: 'top' },
            title: {
            display: true,
            text: 'SGPA Trend Over Semesters',
            },
        },
    };

    return <>
    <section  className="my-sgpa-charts-section">
        <div className="sgpa-chart-sub-new">
            <Line data={data} options={options} height={(window.innerWidth<700)?500:600} width={window.innerWidth}/>
        </div>
       
    </section>
    </>
}

export default MySGPA;
// height={(window.innerWidth<600)?350:600}