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
    let [userSGPA,setUserSGPA]= useState({});
    useEffect(()=>{
      async  function proveAuth(){
           if(drop==0){
            // console.log("Am I running...")
            setDrop(drop+1)
            try {
                 let res = await axios.get(`${API_BASE_URL}/home`,{
                 withCredentials:true,
            })
             setIsAuthenticated(true);
                if(res.data.status){
                    console.log("You are logged in")
                    setIsAuthenticated(true)

                }
                else{
                    console.log("You are not logged in")
                    setIsAuthenticated(false)
                }
            } catch (error) {
                // setIsAuthenticated(false)
                console.log(error)
            }
        }

        
        }
        proveAuth()

    })
    async function getUser(){
            try {
                const response = await axios.get(`${API_BASE_URL}/home`,{
                    withCredentials:true
                })
                if(response.data.status){
                    setUserData((prev)=>{
                        return response.data.userDetails;
                    })
                    return response.data;
                }
            } catch (error) {
                console.log("Error fetching user data: ",error)
            }
        }

        async function retrivePic(){
         
            try {
                  const result = await axios.get(`${API_BASE_URL}/uploads`,{
                withCredentials:true
            })
            if(result.data.status){
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
                else{
                    console.log("Passport did not leave you any cookies :(")
                }
            } catch (error) {
                console.log("Error",error)
            }

        }

        const fetchSemesterData = async (id,sem)=>{
        let table = indexToSemesterStudentTable(sem);
        if(table &&  id){
            try {
                const result =  await axios.get(`${API_BASE_URL}/results?table=${table}&roll_number=${id}`);
                return result.data[0];  //object
            } catch (error) {
                console.error("Error",error)
            }
        }
        else{
            console.log("Sorry seems like table is wrong",table,id)
        }
    }

   async  function allSemesterData(){
        let temp={};
        for(let i=1;i<=3;i++){
            const myData= await fetchSemesterData(userData.roll_number,i);
            temp[`semester_${i}`]= {...myData};
        }
        setUserData((prev)=>{
            let data = {...prev};
            data[`all_semester_results`]={...temp};
            return data;
        })
    }

        

        async function getAll(){
            await getUser();
            await retrivePic();
            await getCredentials();
        }

    useEffect(()=>{
        getAll();
    },[])
    return <>
    <Auth.Provider value={{isAuthenticated,logout,login,userData,refresh:getAll,myResults:allSemesterData}}>
        {children}
    </Auth.Provider>
    </>
}

const useAuth = ()=>{ 
    return useContext(Auth)
}



export {useAuth,AuthProvider}