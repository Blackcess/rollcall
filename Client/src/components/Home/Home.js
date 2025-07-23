import React from 'react';
import { Link, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import "./Home.css"
import axios from 'axios';
import { useEffect } from 'react';
import { useAuth } from '../../Aunthentication/AuthProvider';
function  Home() {

  let sessionData = useAuth();
  
  const navigation= useNavigate();
  useEffect(()=>{
    sessionData.refresh()
  },[])
 
  return (
    <> 
    <section className='home-template'>
    <h1>Welcome To the Home page.</h1>
    <p> If you are here it means you have been authenticated...</p>
    </section>
    
    </>
  );
}   

export default Home;