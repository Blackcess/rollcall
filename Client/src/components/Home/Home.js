import React from 'react';
import { Link, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import "./Home.css"
import axios from 'axios';
import { useEffect } from 'react';
import { useAuth } from '../../Aunthentication/AuthProvider';
import RetrieveAttendance from '../Class/Class Attendance/RetrieveAttendance';
import ShimmerLoader from '../Util Components/ShimmerLoader/ShimmerLoader';
import UnderConstruction from '../Util Components/Under Construction/UnderConstruction';
function  Home() {

  let sessionData = useAuth();
  
  const navigation= useNavigate();
  
 
  return (
    <> 
    <section className='home-template'>
    {(sessionData.loaded) ?<section className='hopme-page-template'>
      <UnderConstruction/>
      </section>
       :
     <ShimmerLoader/>
     }
  

      
    </section>
    
    </>
  );
}   

export default Home;