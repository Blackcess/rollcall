// import { useEffect } from "react"
import { useAuth } from "../../../../../Aunthentication/AuthProvider"
import { useEffect,useState } from "react";
import axios from "axios";
import { indexToSemesterStudentTable, indexToSemesterSubjectsTable } from "../../../../../utils_functions/index_to_semester_table";
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
import ShimmerLoader from "../../../../Util Components/ShimmerLoader/ShimmerLoader";
import { MdBorderColor } from "react-icons/md";
import { Line } from "react-chartjs-2";
import { useLocation } from "react-router-dom";
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


const API_BASE_URL = process.env.REACT_APP_API_URL;


function CompareSGPA(){
    let [allData,setAllData]= useState([]);
    let [dataDone,setDataDone] = useState(false)
    let [player2Data,setPlayer2Data] = useState({});
     const {search} = useLocation();
    const queryParams = new URLSearchParams(search);
    const compRollNumber = queryParams.get("roll_number");


    let sessionData = useAuth();
        useEffect(()=>{
            sessionData.myResults();
            allSemesterData();
    },[])

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
    }
     async  function allSemesterData(){
        let temp={};
        for(let i=1;i<=3;i++){
            const myData= await fetchSemesterData(compRollNumber,i);
            temp[`semester_${i}`]= {...myData};
        }
        setPlayer2Data((prev)=>{
            let data = {...prev};
            data[`all_semester_results`]={...temp};
            return data;
        })
    }

        useEffect(()=>{
            if(Object.keys(player2Data).length){
                // console.log("Palye2 Data",player2Data.all_semester_results,sessionData.userData.all_semester_results)
            }
        })
    
   


    return <>
   <section className="mysgpa-vs-yours">
    <div>
        { (sessionData.userData.all_semester_results && player2Data.all_semester_results)?<SGPA_Chart value={{data1:sessionData.userData.all_semester_results.all_semester_results,data2:player2Data.all_semester_results}}/>:<ShimmerLoader/>}
    </div>

   </section>
    
    </>
}


function SGPA_Chart(props){
     const data = {
            labels: Object.keys(props.value.data1).map((title,index)=>{return title}),
            datasets: [
                            {
                                label: 'Your SGPA',
                                data:Object.keys(props.value.data1).map((title,index)=>{return props.value.data1[title].SGPA}),
                                fill: false,
                                // borderColor: 'rgba(75,192,192,1)',
                                borderColor:"green",
                                tension: 0.3,
                            },
                            {
                                label: 'Player2 SGPA',
                                data:Object.keys(props.value.data2).map((title,index)=>{return props.value.data2[title].SGPA}),
                                fill: false,
                                // borderColor: 'rgba(75,192,192,1)',
                                borderColor:"red",
                                tension: 0.3
                            }
                        ],
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
        <div><Line data={data} options={options} height={(window.innerWidth<600)?350:600}/></div>
       
    </section>
    </>
}






export default CompareSGPA