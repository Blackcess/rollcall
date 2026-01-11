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
import AttendanceHome from './components/Class/Class Attendance/AttendanceHome.js';
import RetrieveAttendance from './components/Class/Class Attendance/RetrieveAttendance.js';
import {SubjectDashboard} from './components/Class/Subjects/Subject.js';
import AttendanceLineChart from './components/Class/Class Attendance/attendance charts/AttendanceLineChart.js';
import Courasel from './components/Class/Class Attendance/Swipper/Swipper.js';
import { SubjectHome } from './components/Class/Subjects/Subject.js';
import AssignmentSolution from './components/Class/Subjects/Individual Subjects/Subject Assignment Logic/AssignmentSolution.js';
import AssignmentDisplay from './components/Class/Subjects/Individual Subjects/Subject Assignment Logic/AssignmentDisplay.js';
import RenderSyllabus from './components/Class/Subjects/Individual Subjects/Subject Syllabus Logic/SubjectSyllabusRender.js';
import {IndividualSubject} from './components/Class/Subjects/Individual Subjects/IndividualSubject.js';
import AddLongSolutionForm from './components/Class/Subjects/Individual Subjects/Subject Assignment Logic/Assignment Management Center (Admin Only)/AssignmentManagement.js';
import AssignmentList from './components/Class/Subjects/Individual Subjects/Subject Assignment Logic/MyAssignments.js';
import { SelectCourseOptions } from './components/Class/Subjects/Individual Subjects/IndividualSubject.js';
import ArticleEditorPage from './components/Custom Editor/StudyArticle.js';
import ContentDisplayPage from './components/Custom Editor/Article Viewers/ContentDisplayPage.js';
import ActualViewer from './components/Custom Editor/Article Viewers/ActualViewer.js';
import AuthorDashboard from './components/Custom Editor/Authors\' Articles/AuthorPanel.js';
import SemesterEnrollmentPage from './components/Admin/semester-enrollment/SemesterEnrollmentPage.js';
import AdminTimetablePage from './components/Admin/timetable/AdminTimetable.js';
import { Admin } from './components/Admin/Admin.js';
import AttendanceHome_Admin from './components/Admin/attendance/pages/AttendanceHome.js';
import AttendanceSlotMark from './components/Admin/attendance/pages/AttendanceSlotMark.js';
import SessionWorkspace from './components/Admin/lecture sessions/Pages/SessionWorkspace.js';
import LectureDetail from './components/Class/student lecture sessions/Pages/LectureDetails.js';
import { LectureSummary } from './components/Class/student lecture sessions/Pages/Lecture details sub pages/summary/LectureSessionSummary.js';
import { LectureTopics } from './components/Class/student lecture sessions/Pages/Lecture details sub pages/topics/LectureSessionTopics.js';
import { LectureNotes } from './components/Class/student lecture sessions/Pages/Lecture details sub pages/notes/LectureSessionNotes.js';
import { LectureFiles } from './components/Class/student lecture sessions/Pages/Lecture details sub pages/files/LectureSessionFile.js';
import { LectureComments } from './components/Class/student lecture sessions/Pages/Lecture details sub pages/comments/LectureComments.js';

function App() {
  
  let location = useLocation();
  return <>
  <section className='rollcall-template'>
   <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
  <Routes  >
    <Route path="/" element={<Access/>}/>
    <Route path="/create-account" element={<CreateAccount/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path='/protected' element={<Protected/>} >
    <Route path="layout" element={<Layout/>}>
      <Route path="home"element={<Home/>}/>
      {/* <Route path="home"element={<SemesterEnrollmentPage/>}/> */}
      <Route path="class" element={<Class/>}>
        <Route path="class-timetable" element={<TimeTable/>}>
          <Route path="day-schedule" element={<DaySchedule/>}/>
          <Route path="day-schedule-weekend" element={<WeekendSpecial/>}/>
        </Route>
        <Route path="class-attendance" element={<AttendanceHome/>}/>
        <Route path="class-attendance-record" element={<MyAttendance/>}/>
        <Route path="class-lecture-details/:sessionId" element={<LectureDetail/>}>
          <Route path="summary" element={<LectureSummary/>}/>
          <Route path="topics" element={<LectureTopics/>}/>
          <Route path="notes" element={<LectureNotes/>}/>
          <Route path="files" element={<LectureFiles/>}/>
          <Route index element={<LectureComments/>}/>
        </Route>
        <Route path="class-attendance-retrieve" element={<RetrieveAttendance/>}/>
        <Route path="chatSystem" element={<PersonalMessaging/>}/>
       
        <Route path="my-chats-add" element={<AddChat/>}/>
        <Route path='subjects' element={<SubjectHome/>}>
          <Route index element={<SubjectDashboard/>}/>
          
          <Route path='individual-course' element={<IndividualSubject/>}>
            <Route index element={<SelectCourseOptions/>}/>
            <Route path='subject-syllabus' element={<RenderSyllabus/>}/>
            <Route path='subject-assignments' element={<AssignmentList/>}/>
            <Route path='subject-assignments-display' element={<AssignmentDisplay/>}/>
            <Route path='assignment-management' element={<AddLongSolutionForm/>}/>
            <Route path='assignment-solution' element={<AssignmentSolution/>}/>
          </Route>
          {/* <Route path='course-time-table'/> */}
        </Route>

      </Route>
       <Route path="my-chats" element={<InsideChat/>}/>
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
      <Route path="editor" element={<ArticleEditorPage/>}/>
      <Route path="study-material" element={<ContentDisplayPage/>}/>
      <Route path="study-material-viewer" element={<ActualViewer/>}/>
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
      <Route path="author-panel" element={<AuthorDashboard/>}/>
      <Route path='admin' element={<Admin/>}>
        <Route path="enrollment" element={<SemesterEnrollmentPage/>}/>
        <Route path="timetable/:classId/:semester" element={<AdminTimetablePage/>}/>
        <Route path="attendance" element={<AttendanceHome_Admin/>}/>
        <Route path="lecture/workspace/:classId/:semester/:slotId" element={<SessionWorkspace/>}/>
        <Route path="attendance/slot-mark/:classId/:semester/:slotId" element={<AttendanceSlotMark/>}/>
      
      </Route>
      </Route>
    </Route>
  </Routes>
 </section>
  </>
}
export default App;
