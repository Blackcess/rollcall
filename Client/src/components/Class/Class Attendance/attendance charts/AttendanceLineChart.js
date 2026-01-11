import "./AttendanceLineChart.css"
import { Line } from "react-chartjs-2"
import axios from "axios"
import { useEffect,useState } from "react"
import { useAuth } from "../../../../Aunthentication/AuthProvider"
import { fetchAttendanceRecords } from "../API/attendanceAPI"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  plugins,
} from "chart.js";
import zoomPlugin, { zoom } from 'chartjs-plugin-zoom';
import SpinLoader from "../../../Util Components/SpinLoader/SpinLoader"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend,zoomPlugin);
const API_BASE_URL = process.env.REACT_APP_API_URL;

function AttendanceLineChart(props){
    const [attendance,setAttendance] = useState([])
    const [attendanceDone,setAttendanceDone] = useState(false)
    const [chartData,setChartData] = useState(null)
    const [done,setDone] = useState(false)
    const sessionData = useAuth()

    useEffect(()=>{
        getAttendance()
    },[])

    const getAttendance= async ()=>{
        try {
            const {data}  = await fetchAttendanceRecords(sessionData.userData.semester)
            if(data){
                // console.log("My intended data is ",response.data.data)
                setAttendance(data)
                setAttendanceDone(true)
            }
        } catch (error) {
            console.error(error)
            setAttendanceDone(false)
        }
    }

    useEffect(()=>{
        if(attendanceDone){
            const filtered = subjectFilter(props.value.subject)
            filtered.map((row)=>{
                row.date=row.date.split("T")[0]
            })
            // console.log("Calaz Seh",filtered)
            const values = filtered.map((d) => (d.status ? 1 : 0)); // KEEP numeric!
            const pointColors = values.map((v) => v === 1 ? "rgba(16,185,129,1)" : "rgba(239,68,68,1)");
            // console.log("My Colors of love are: ",pointColors)
            setChartData({
                    labels: filtered.map(d => d.date),
                    datasets: [
                        {
                            label: `${props.value.subject} Attendance `,
                            data: filtered.map(d => (d.status) ),
                            // borderColor: "rgba(61, 100, 127, 1)",
                            borderColor: "red",
                            fill: false,
                            borderWidth:1,
                            borderJoinStyle:"miter",
                            cubicInterpolationMode:'monotone',
                            fill:"origin",
                            pointStyle:"triangle",
                            spanGaps: true,
                            pointBackgroundColor: pointColors,
                            tension:1,
                            backgroundColor:"rgba(61, 100, 127, 1)"
                        }
                    ]
                });
                setDone(true)
        }
        
    },[attendanceDone])

    // filter attendance by subject
    const subjectFilter = (subject)=>{
        if(attendanceDone){
            const subjectAttendance= attendance.filter((row)=>row.subject_name===subject)
            if(subjectAttendance) return subjectAttendance
        }
        else{
            return []
        }
    }
    const options = {
        responsive:true,
        maintainAspectRatio:false,
        
        scales: {
            y: {
                // type: "category",
                min: 0,
                max: 1,
                ticks: {
                    color: '#ffffff',
                    stepSize: 1,
                    callback: function (value) {
                        return value === 1 ? "Present" : "Absent";
                    }
                },
                 title: {
          display: true,
          text: 'Subjects',
         // color: '#ffcc00'  // ✅ color of x-axis title
         color:"green"
        }
            },
            x: {
        ticks: {
          color: '#ffffff'  // ✅ color of x-axis labels
        },
        title: {
          display: true,
          text: 'dates',
         // color: '#ffcc00'  // ✅ color of x-axis title
         color:"green"
        }
      },
        },
        plugins:{
        zoom: {
                pan: {
                    enabled: true,
                    mode: "x", // only horizontal
                },
            zoom: {
                wheel: {
                    enabled: true, // zoom with mouse
                },
                pinch: {
                    enabled: true, // zoom on touch screen
                },
                mode: "x",
            },
        },
            legend: {
                labels: {
                    font: {
                        size: 12,
                        weight: '100'
                    },
                    color: 'white',
                    padding: 20
      }
    }
        }
    };
    return <>
    <section className="chart-template-x">
        {(attendanceDone && done) &&
            <Line  data={chartData} options={options}/>
         
        }
    </section>    
    </>
}
export default AttendanceLineChart