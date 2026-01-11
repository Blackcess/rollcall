import "./AddChat.css"
import axios from "axios";
import { useEffect,useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import ShimmerLoader from "../../Util Components/ShimmerLoader/ShimmerLoader";


const API_BASE_URL = process.env.REACT_APP_API_URL;


function AddChat(){

    const [activatedUsers,setActivatedUsers] = useState([]);
    const [usersDone,setUsersDone] = useState(false);


    useEffect(()=>{
        getMoreChats();
    },[])
    async function getMoreChats(){
            
            try {
                const response= await axios.get(`${API_BASE_URL}/my-activated-users`,{
                    withCredentials:true
                    })
                if(response.data.status){
                    console.log("These are the students who have created accounts...",response.data.data)
                    setActivatedUsers(()=>{
                        return response.data.data
                    });
                    setUsersDone(true)
                }
            } catch (error) {
                console.error(error);
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
    
    


    return <>
    <section className="add-chat-template">
        <h3>Invite Friends For A Chat</h3>
        {(usersDone)?<div className="my-chat-list-invite">
            {
                activatedUsers.map((row,index)=>{
                    return <Chat key={index} value = {{data:row,imager:imagerResolver}}/>
                })
            }
        </div>
        :
        <ShimmerLoader/>
        
    }
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
        </div>
    </NavLink>
    </>
}
const StyledProf = styled.div`
    height:40px;
    width:40px;
    border-radius:50%;
    background-image:url(${(props)=>{return (props.value.data.profile_picture) ? `${props.value.imager(props.value.data)}`:"data:image/jpeg;base64,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"}});
    background-position:center;
    background-size:cover;
    `

export default AddChat