import "./Swipper.css"
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination,Autoplay} from "swiper/modules";
import AttendanceLineChart from "../attendance charts/AttendanceLineChart";


function Courasel(){
    const subjects = ["PIP","FLAT","ERP","DBMS"]

    return <>
        <Swiper
      modules={[Navigation, Pagination,Autoplay]}
      navigation
      pagination={{ clickable: true }}
      spaceBetween={30}
      loop={true}
      autoplay={{
          delay: 4000,   // 4s per slide
          disableOnInteraction: false, // keep autoplay after user swipe
           pauseOnMouseEnter: true, 
        }}
    //   spaceBetween={20}
      slidesPerView={1}
       breakpoints={{
    640: { slidesPerView: 2 },  // small tablet: 2 per row
    1024: { slidesPerView: 3 }, // desktop: 3 per row
  }}
    >
    {
        subjects.map((subject,index)=>(
            <SwiperSlide key={Math.random()*10000}>
                <div className="chart-card chart-data-cont">
                    <h3 style={{ textAlign: "center" ,color:"green"}}>{subject}</h3>
                    <AttendanceLineChart value={{subject}}/>
                </div>
                
            </SwiperSlide>
        ))
    }

    </Swiper>
    
  
    </>
}

export default Courasel