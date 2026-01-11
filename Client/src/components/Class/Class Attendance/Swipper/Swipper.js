import "./Swipper.css"
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination,Autoplay} from "swiper/modules";
import AttendanceLineChart from "../attendance charts/AttendanceLineChart";
import { useAuth } from "../../../../Aunthentication/AuthProvider";
import { fetchSubjects } from "../../../Admin/timetable/api/adminTimetable";
import SpinLoader from "../../../Util Components/SpinLoader/SpinLoader";


function Courasel(){
    const [subjects,setSubjects] = useState([]);
    const [subjectsLoaded,setSubjectsLoaded] = useState(false)
    const sessionData = useAuth()
    // const subjects = ["PIP","FLAT","ERP","DBMS"]
    useEffect(()=>{
        const loadData = async ()=>{
            try {
                const data = await fetchSubjects(sessionData.userData.semester)
                const updtated_data = data.filter((sub)=>sub.name!=="BREAK")
                setSubjects(()=>{
                    return updtated_data
                })
            } catch (error) {
                console.error("Error Fetching subjects")
            }
            finally{
                setSubjectsLoaded(true)
            }
        }
      loadData()
    },[])

    return <>
    {(subjectsLoaded)?<Swiper
      modules={[Navigation, Pagination,Autoplay]}
      navigation
      pagination={{ clickable: true }}
      spaceBetween={30}
      loop={true}
      autoplay={{
          delay: 5000,   // 4s per slide
          disableOnInteraction: false, // keep autoplay after user swipe
           pauseOnMouseEnter: true, 
        }}
    //   spaceBetween={20}
      slidesPerView={1}
       breakpoints={{
    640: { slidesPerView: 2 },  // small tablet: 2 per row
    1024: { slidesPerView: 2 }, // desktop: 3 per row
  }}
    >
    {
        subjects.map((subject,index)=>(
            <SwiperSlide key={Math.random()*10000}>
                <div className="chart-card chart-data-cont">
                    {/* <h3 style={{ textAlign: "center" ,color:"green"}}>{subject}</h3> */}
                    <AttendanceLineChart value={{subject:subject.name}}/>
                </div>
                
            </SwiperSlide>
        ))
    }

    </Swiper>
    :
    <SpinLoader/>
    }
    
  
    </>
}

export default Courasel