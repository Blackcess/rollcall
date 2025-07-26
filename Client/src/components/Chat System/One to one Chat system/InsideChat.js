import { useEffect,useState } from "react"
import "./InsideChart.css"
import { useSocket } from "../../Protected Area/Protected"
import { useLoaderData, useLocation } from "react-router-dom";

function InsideChat(){
    const {socket} = useSocket()
    const [myMessage,setMyMessage] = useState("");
    const  [messageList,setMessageList] = useState([]);
    const location  = useLocation()
    const {search} = location;
    const myParams = new  URLSearchParams(search);
    const endpointRollNumber = myParams.get("roll_number");
    let [emitDone,setEmitDone] = useState(false)

      
    
   
    const handleSend = (e)=>{
        e.preventDefault();
        if(myMessage.length){
          setMessageList((prev)=>{
            return [...prev,myMessage];
          })
          socket.emit("chat-message",{
            to:endpointRollNumber,
            message:myMessage,
          })
          setMyMessage("");
        }
    }
    useEffect(()=>{
      if(endpointRollNumber && !emitDone){
        socket.emit("request-missed-messages",{to:endpointRollNumber},(response)=>{
          console.log("My messages with this person...",response);
          for(let i=0;i<response.length;i++){
            setMessageList((prev)=>{
              return [...prev,response[i].message]
            })
          }
          setEmitDone(true);
        });
      }
      else{
        console.log("Failed to load chat history...")
      }
    })

    
    // socket.on("missed-messages",(data)=>{
    //       console.log("My messages with this person...",data)
    //   })

   socket.on("receive-message", ({ from, message }) => {
          console.log(`New message from ${from}: ${message}`);
          // Update your chat UI here
          console.log(`received message from ${from}`,message)
            setMessageList((prev)=>{
            return [...prev,message];
          })
           
    });
    return <>
    <div className="chat-wrapper">
  <h1>Chat with Thomas</h1>
  <div className="messages" id="messages-container">
    {/* Rebder chat bubbles here */}
    {
      messageList.map((message,index)=>(
          <MessageBox value={{message}} key={index}/>
      ))
    }
  </div>
  <form className="chat-input-area">
    <input type="text" placeholder="Type a message..." value={myMessage} onChange={(e)=>{
        setMyMessage(e.target.value);
    }}/>
    <button type="submit" onClick={handleSend}>Send</button>
  </form>
</div>
    
    </>
}

function MessageBox (props){

  return <>
  <section className="message-box-design">
    <div className="chatty">{props.value.message}</div>
  </section>
  </>
}

export default InsideChat