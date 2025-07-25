// import { httpServer } from "../src/server.js";
import { getConversationsList,insertMessage } from "../Live ChatDB_API/liveChatDBFunctions.js";


const mySocketLogic = (io)=>{
    let activeUserMap = new Map(); 

    io.use((socket,next)=>{
        const userId = socket.handshake.auth.userId;
        // console.clear()
        console.log("User is ",socket.handshake.auth.userId);
        if(userId){
            socket.userId = userId;
            socket.user_error=true;
        }
        else{
             socket.userId = undefined;
            socket.user_error=false;
        }
        next()
    })

    io.on("connect",async (socket)=>{
        
        if(socket.userId){
            activeUserMap.set(socket.userId,socket.id)
            console.log(socket.userId, "Is  online");
            let conversationList = await getChats(socket.userId)
            socket.emit("conversation-list",conversationList);
        }
        else{
            socket.emit("unauthorized","You are not authorized")
        }
        
        socket.on("disconnect",()=>{
            console.log(socket.userId, "is disconnected")
        })
    })

    
}



async function getChats (userOne ){

      try {
            const res = await getConversationsList(userOne);
            return res;
        } catch (error) {
            console.log(error)
        }

}

// console.log("Check this out : ",await getChats())

export {mySocketLogic}