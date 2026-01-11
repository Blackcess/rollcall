import { useEffect, useState } from "react"
import "./PersonalMessaging.css"
import {io} from "socket.io-client"
import {useAuth} from "../../../Aunthentication/AuthProvider"
import { IoAdd } from "react-icons/io5";
import axios from "axios";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import UploadPic from "../../Profile/Profile Picture/UploadPic";
import { useSocket } from "../../Protected Area/Protected";
import SpinLoader from "../../Util Components/SpinLoader/SpinLoader";

const API_BASE_URL = process.env.REACT_APP_API_URL;

function PersonalMessaging(){
    let sessionData = useAuth();
    let [conversationList,setConversationList]= useState([])
    let [securityFlag,setSecurityFlag] = useState(false)
    const [conversationDone,setConversationDone]= useState(false)
    var {socket} = useSocket();  //get the socket connectsion from the provider...
    const checkAuthentication = (socket)=>{
        socket.on("unauthorized",()=>{
            setSecurityFlag(true)
            console.log("There are security errors occuring right now please try again error")
        })
    }
    useEffect(()=>{
        sessionData.refresh()
        // console.log("sessionD",sessionData.userData.roll_number)
        //    socket = connectSocket(); 
        checkAuthentication(socket);
       
        // socket.on("conversation-list",(data)=>{
        //     // console.log('Data from database is ',data);
        //     let others=[]
        //     for(let i=0;i<data.length;i++){
        //         // first check if user_one is me 
        //         let temp ={};
        //         if(data[i].user_one_id!==sessionData.userData.roll_number){
        //             temp.otherUser=data[i].user_one_id;   
        //         }
        //         else{
        //             if(data[i].user_two_id!==sessionData.userData.roll_number){
        //                 others.push(data[i].user_two_id);
        //                 temp.otherUser=data[i].user_two_id;
        //             }
        //         }
        //         temp.id=data[i].id;
        //         temp.time=data[i].time;
        //         temp.lastMessage=data[i].lastMessage;
        //         others.push(temp);
        //     }
        //     setConversationList(others)
        // });
        // getMoreChats()
        },[])

        const getConversationListReq = async ()=>{
            try {
                const res= await axios.get(`${API_BASE_URL}/rollcall-chats/userChats`,{
                    withCredentials:true
                })
                if(res.data.status){
                   
                    // setConversationDone(true)
                    // setConversationList(res.data.data)
                    const myId = sessionData.userData.roll_number;
                    const formatted = res.data.data.map(convo => {
                        const otherUser =
                            convo.user_one_id === myId
                            ? convo.user_two_id
                            : convo.user_one_id;

                        return {
                            id: convo.id,
                            otherUser,
                            lastMessage: convo.lastMessage,
                            time: convo.time
                    };
                     
                    });
                    // console.log("Conversation list is ",formatted)
                    setConversationList(formatted);
                    setConversationDone(true)
                }
            } catch (error) {
                console.error("Error fetching conversation list: ",error)
            }
        }
        useEffect(()=>{
            if(!conversationDone){
                 getConversationListReq();
            }
        })

    return <>
    <section className="chat-system-container">
        {/* <h2 className="personal-messages-heading">Personal Messages</h2> */}
        <div  className="conversation-list-container">
            {
                (!conversationList.length ) ?
                (conversationDone) ?
                <div className="no-chats-cobntainer">
                    <h3 className="no-chat-flag"> Start Messaging...</h3>
                    <div className="add-chat-icon">  <IoAdd /> </div>
                </div>
                :
                <SpinLoader/>
                :
                <div className="my-chats-template">
                    <Chatting value={{myChats:conversationList}}/>   
                </div>
            }
        </div>
        {(conversationDone) && <NavLink className="add-more-chats" to={`/protected/layout/class/my-chats-add`}><IoAdd /></NavLink>}
    </section>
    
    </>
}


function Chatting (props){
    let [allData,setAllData]= useState([]);
    let [dataDone,setDataDone] = useState(false);
    let [friends,setFriends] = useState([]);
    let [friensDone,setFriendsDone] = useState(false)

    useEffect(()=>{
        getAllCompetitors();
    },[])

    async function  getAllCompetitors(){
            
            try {
                const result=await axios.get(`${API_BASE_URL}/students/all`,{
                            withCredentials:true
                    })
                    if(result.data.status){
                        setDataDone(true);
                        setAllData([...result.data.value])
                    }
            } catch (error) {
                setDataDone(false)
                console.error(error)
            }
        }
    
        
        function imagerResolver(row){
          if(row.profile_picture_type){
            if(row.profile_picture_type.length &&  row.profile_picture_type==="default"){
              return row.profile_picture;
            }
            else{
              if(row.profile_picture_type==="user"){
                return `${API_BASE_URL}/${row.profile_picture.replace(/\\/g, "/")}`
              }else{
                console.log("profPicType is empty")
              }
            }
          }
          else{
            console.log("profPicType is not defined")
          }
      }

      useEffect(()=>{
            uploadFriends();
            setDataDone(false)
            setFriendsDone(true)
        
        },[dataDone])

      function  uploadFriends(){
        if(dataDone){
            for(let i=0;i<props.value.myChats.length;i++){
            let temp = allData.find((row)=>row.roll_number === props.value.myChats[i].otherUser)
            setFriends((prev)=>{
                temp = {...temp,...props.value.myChats[i]};
                return [...prev,temp]
            })
            }
        }
    }


    return <>
        <section className="chatting-template">
             {(friensDone) &&<div className="my-competitor-list-ext">
        {
            friends.map((row,index)=>{
                if(Object.keys(row).length){
                    return <Chat key={index} value={{data:row,imager:imagerResolver}}/>
                }
                
               
        })
        }
    </div>}
        </section>
    </>
}


function Chat(props){
//   useEffect(()=>{console.log("Check props",props)})
    return <>
    <NavLink className="chat-template" to={`/protected/layout/my-chats?roll_number=${props.value.data.roll_number}` }>
        <StyledProf value={{data:props.value.data,imager:props.value.imager}}></StyledProf>
        <div className="message-pop-up">
            <div className="competitor-name-field-1">{props.value.data.student_name}</div>
            <div className="my-last-message">
               {(props.value.data.lastMessage) &&<span className="msg">{props.value.data.lastMessage} </span>} 
              {(props.value.data.time)&&  <span className="msg-1">{props.value.data.time.split("T")[1].split(".")[0]} </span> }
            </div>
        </div>
    </NavLink>
    </>
}


const StyledProf = styled.div`
    height:100%;
    aspect-ratio:1/1;
    width:50px;
    border-radius:50%;
    background-image:url(${(props)=>{return (props.value.data.profile_picture) ? `${props.value.imager(props.value.data)}`:"data:image/jpeg;base64,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"}});
    background-position:center;
    background-size:cover;
    // border:1px solid #ccc;

    `
export default PersonalMessaging