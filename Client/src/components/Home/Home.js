import React from 'react';
import { Link, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import "./Home.css"
import axios from 'axios';
import { useEffect } from 'react';
import { useAuth } from '../../Aunthentication/AuthProvider';
import RetrieveAttendance from '../Class/Class Attendance/RetrieveAttendance';
import ShimmerLoader from '../Util Components/ShimmerLoader/ShimmerLoader';
function  Home() {

  let sessionData = useAuth();
  
  const navigation= useNavigate();
  
 
  return (
    <> 
    <section className='home-template'>
    <h1>Welcome To the Home page.</h1>
    {(sessionData.loaded) ?<p> If you are here it means you have been authenticated...</p> :
     <ShimmerLoader/>
     }
  

      
    </section>
    
    </>
  );
}   

export default Home;