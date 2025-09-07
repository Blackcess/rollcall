import './App.css';
import React from 'react';
import About from './components/About/About.js';
import Home from './components/Home/Home.js';
import Products from './components/Products/AllProducts.js';
import Profile from './components/Profile/Profile.js';
import Login from './components/Login/AccessPoint.js';
import {Protected} from './components/Protected Area/Protected.js';
import {Layout} from './components/Layout/Layout.js'
import Class from './components/Class/Class.js';
import Dashboard from './components/Dashboard/Dashboard.js';
import { Routes,Route,useLocation } from 'react-router-dom';
import MobileDashBoard from './components/Dashboard/Mobile DashBoard/MobileDashBoard.js';
import ActualSemesterData from './components/Dashboard/Mobile DashBoard/Semesters/ActualSemester.js';
import DesktopDashboard from './components/Dashboard/Desktop Dashboard/DesktopDashboard.js';
import DashBoardChartsDeskTop from './components/Dashboard/Desktop Dashboard/ActualSemester_Desktop.js';
import ActualSemesterData_Desktop from './components/Dashboard/Desktop Dashboard/ActualSemester_Desktop.js';
import SemesterSubjects from './components/Dashboard/Mobile DashBoard/Semesters/SemesterSubjects.js';
import SemesterSubjectsDesktop from './components/Dashboard/Desktop Dashboard/SemesterSubjectsDesktop.js';
import Access from './components/Access/Access.js';
import { useEffect } from 'react';
import Logout from './components/Logout/Logout.js';
import CreateAccount from './components/Account Creation/CreateAccount.js';
import MyProfile from './components/Profile/My Profile/MyProfile.js';
import DefaultProf from './components/Profile/Default Profile/DefaultProfile.js';
import AddDetails from './components/Profile/My Profile/AddDetails.js';
import EditProfile from './components/Profile/Profile Picture/EditProfile.js';
import UploadPic from './components/Profile/Profile Picture/UploadPic.js';
import MySGPA from './components/Profile/Academic Statistics/My SGPA/MySGPA.js';
import StatsSelection from './components/Profile/Academic Statistics/Stats Selection/StasSelection.js';
import CompareGrades from './components/Profile/Academic Statistics/Compare Grades/CompareGrades.js';
import CompareIndexRoute from './components/Profile/Academic Statistics/Compare Grades/Index  Route/Compare_IndexRoute.js';
import SelectCompetitor from './components/Profile/Academic Statistics/Compare Grades/Competitor Selection/SelectCompetitor.js';
import ComparisonAnalytics from './components/Profile/Academic Statistics/Compare Grades/Competitor Selection/ComparisonAnalytics.js';
import CompareSGPA from './components/Profile/Academic Statistics/Compare Grades/Competitor Selection/CompareSGPA.js';
import CompareOnSemester from './components/Profile/Academic Statistics/Compare Grades/Competitor Selection/CompareOnSemester.js';
import PersonalMessaging from './components/Chat System/One to one Chat system/PersonalMessaging.js';
import InsideChat from './components/Chat System/One to one Chat system/InsideChat.js';
import VisitorProfile from './components/Profile/Visitor Profile/VisitorProfile.js';
import AddChat from './components/Chat System/One to one Chat system/AddChat.js';
import {TimeTable} from './components/Class/Class TimeTable/Timetable.js';
import DaySchedule from './components/Class/Class TimeTable/IndividualDaySchedule.js';
import WeekendSpecial from './components/Class/Class TimeTable/WeekendSpecial.js';
import MyAttendance from './components/Class/Class Attendance/MyAttendance.js';
import {ToastContainer} from "react-toastify"

function App() {
  
  let location = useLocation();
  return <>
   <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
  <Routes  >
    <Route path="/" element={<Access/>}/>
    <Route path="/create-account" element={<CreateAccount/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path='/protected' element={<Protected/>} >
    <Route path="layout" element={<Layout/>}>
      <Route path="home"element={<Home/>}/>
      <Route path="class" element={<Class/>}>
        <Route path="class-timetable" element={<TimeTable/>}>
          <Route path="day-schedule" element={<DaySchedule/>}/>
          <Route path="day-schedule-weekend" element={<WeekendSpecial/>}/>
        </Route>
        <Route path="class-attendance" element={<MyAttendance/>}/>
        <Route path="chatSystem" element={<PersonalMessaging/>}/>
        <Route path="my-chats" element={<InsideChat/>}/>
        <Route path="my-chats-add" element={<AddChat/>}/>
      </Route>
      <Route path="dashboard" element={<Dashboard/>}>
        <Route path='mobile' element={<MobileDashBoard/>}>
          <Route path='semester/:index' element={<ActualSemesterData/>}/>
          
        </Route>
        <Route path="desktop" element={<DesktopDashboard/>}>
          <Route path='charts/:index' element={<ActualSemesterData_Desktop/>}/>
        </Route>
        <Route path='subject' element={<SemesterSubjects/>}/>    
        <Route path='subject/desk' element={<SemesterSubjectsDesktop/>}/>    
      </Route>
      <Route path="profile" element={<Profile/>}>
        <Route index element={<DefaultProf/>}/>
        <Route path="myProfile" element={<MyProfile/>}/>
        <Route path="addDetails/:field" element={<AddDetails/>}/>
        <Route path="edit-profile" element={<EditProfile/>}/>
        <Route path='edit-personal-pic' element={<UploadPic/>}/>
        <Route path='select-academic-stats' element={<StatsSelection/>}/>
      </Route>
      <Route path='my-sgpa' element={<MySGPA/>}/>
      <Route path='compare-grades' element={<CompareGrades/>}>
        <Route index element={<CompareIndexRoute/>}/>
        <Route path="comparison-selection" element={<SelectCompetitor/>}/>
        <Route path="comparison-analytics" element={<ComparisonAnalytics/>}>
        <Route path="sgpa-compare" element={<CompareSGPA/>}/>
        <Route path="semester-compare" element={<CompareOnSemester/>}/>
        </Route>
      </Route>
      <Route path="about" element={<About/>}/>
      <Route path="logout" element={<Logout/>}/>
      
      <Route path="visitor-profile" element={<VisitorProfile/>}/>
      
      

      </Route>
    </Route>
  </Routes>
 
  </>
}

export default App;
