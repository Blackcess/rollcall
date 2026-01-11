import "./Tesing.css"
import {Line,Doughnut} from "react-chartjs-2"
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
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Testing(){
    const mydata = [
        {year:"2020", profit:800},
        {year:"2021", profit:500},
        {year:"2022", profit:900},
        {year:"2023", profit:300},
        {year:"2024", profit:200},
        {year:"2025", profit:700},
        {year:"2026", profit:700},
        {year:"2027", profit:800},
    ]
    const data2= [355,676,353,44,979,242,727,100]


    return <>
   

    <section>
     <Doughnut data={
        {
            labels:mydata.map((row)=>(row.year)),
            datasets:[
                {
                    label:"Thomas",
                    data:mydata.map((row)=>(row.profit)),
                     backgroundColor: [
        '#FF6384', // Red
        '#36A2EB', // Blue
        '#FFCE56', // Yellow
        '#4BC0C0'  // Teal
      ],
                },
                // {
                //     label:"Malcom",
                //     data:data2.map((row)=>(row)),
                //     borderColor:"green",
                //     fill:false,
                //     tension:0.1
                // }
            ]
        }
       
    }

    options={
        {
            responsive:true,
            maintainAspectRatio:false,
            plugins:{
                legend:{
                    position: 'right', // <-- moves the legend to the right
                    // labels: {
                    // boxWidth: 20,
                    // padding: 15,
                    // }
                }
            }
        } 
    }   
     height={200}  
       />

    </section>
    </>
}

export default Testing