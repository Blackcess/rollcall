import { createContext, useContext, useState } from "react"
import { useEffect } from "react";
import axios from "axios";
import { indexToSemesterStudentTable, indexToSemesterSubjectsTable } from "../utils_functions/index_to_semester_table";
import { translateName,reverseTranslateName } from "../utils_functions/subject_name_translation";
import { grade_value,reverseGrade_value } from "../utils_functions/grade_to_value_transformation";
import { elements } from "chart.js";

const Auth= createContext();
const API_BASE_URL = process.env.REACT_APP_API_URL;
function AuthProvider({children}){


    const [isAuthenticated,setIsAuthenticated] = useState(false);
    let [drop,setDrop]=useState(0);
    const login=()=> setIsAuthenticated(true);
    const logout=()=> setIsAuthenticated(false);
    const [userData,setUserData] = useState({});
    const [renderProf,setRenderProf]= useState(false)
    const [profPicType,setProfPicType]= useState(false)
    const [profPic,setProfPic]= useState(false)
    const [credentials,setCredentials]=useState({})
    const [loaded,setLoaded] = useState(false)
    let [userSGPA,setUserSGPA]= useState({});
    async  function proveAuth(){
           if(drop==0){
            // console.log("Am I running...")
            setDrop(drop+1)
            try {
                 let res = await axios.get(`${API_BASE_URL}/home`,{
                 withCredentials:true,
            })
            //  setIsAuthenticated(true);
                if(res.data.status){
                    // console.log("You are logged in")
                    setIsAuthenticated(true)

                }
                else{
                    // console.log("You are not logged in")
                    setIsAuthenticated(false)
                }
            } catch (error) {
                setIsAuthenticated(false)
                console.log(error)
            }
        }
        }
    async function getUser(){
            try {
                const response = await axios.get(`${API_BASE_URL}/home`,{
                    withCredentials:true
                })
                if(response.data.status){
                    console.log("Home response",response.data)
                    setUserData((prev)=>{
                        return response.data.userDetails;
                    })
                    // return response.data;    
                }
            } catch (error) {
                console.log("Error fetching user data: ",error)
            }
        }
        async function retrivePic(){
            try {
                  const result = await axios.get(`${API_BASE_URL}/my-uploads`,{
                withCredentials:true
            })
            if(result.data.status){
                // console.log("The Profile image is ", result.data.path)
                setRenderProf(true);
                setProfPicType(result.data.type);
                setProfPic(result.data.path)
                setUserData((prev)=>{
                    let data = {...prev};
                    data= {...data,profPicType:result.data.type,profPic:result.data.path};
                    return data;
                })
            }
            } catch (error) {
                console.log("Error in image path",error)
            }
        }

        async function getCredentials(){
            try {
                const result = await axios.get(`${API_BASE_URL}/personal-details`,{
                    withCredentials:true
                })
                // console.log("My Credentials",result.data.data);
                if(result.data.status && result.data.data.value){
                    
                    setUserData((prev)=>{
                        let data =  {...prev,credentials: result.data.data.value[0]}
                        return data;
                    })
                }
            } catch (error) {
                console.log("Error",error)
            }
        }

   async  function allSemesterData(){

        try {
            const res = await axios.get(`${API_BASE_URL}/Student/results/all-semesters?roll_number=${userData.roll_number}`,{
                withCredentials:true
            })
            if(res.data.status){
                setUserData((prev)=>{
                    let data = {...prev};
                    data[`all_semester_results`]=res.data.data;
                    return data;
                })
            }
            return res.data.data;
        } catch (error) {
            console.error("Error fetching all semester results",error)
        }
    }
        async function getAll(){
            try {
                await proveAuth()
                await getUser();
                await retrivePic();
                await getCredentials();
            } catch (error) {
                console.error(error)
            }
            finally{
                setLoaded(true)
            }
        }

    useEffect(()=>{
        getAll();
    },[])
    
    return <>
    <Auth.Provider value={{isAuthenticated,logout,login,userData,refresh:getAll,myResults:allSemesterData,loaded}}>
        {children}
    </Auth.Provider>
    </>
}

const useAuth = ()=>{ 
    return useContext(Auth)
}



export {useAuth,AuthProvider}