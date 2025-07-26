// import { httpServer } from "../src/server.js";
import { getConversationsList,insertMessage } from "../Live ChatDB_API/liveChatDBFunctions.js";
import { connection } from "../database connections/databaseConnect.js";


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
        //user client emits this to check if any messages where sent while they were offline
        socket.on("request-missed-messages", async ({to},callback) => {
            const [messages] = await connection.query("SELECT * FROM one_one_messages WHERE sender_id = ? OR sender_id = ?", [socket.userId,to]);
            console.log(`Messages between ${socket.userId} amd ${to}: `,messages)
            // io.to(to).emit("missed-messages", {data:messages});
            callback(messages)
        });
        //user client emits this when they send a message
        socket.on("chat-message",async ({to,message})=>{
            const from = socket.userId;
            //send the message to the database...
            await insertMessage(from,to,message);
            //send to receipiant if receipiant is online
            const receipiant = activeUserMap.get(to);
            if(receipiant){
                  io.to(receipiant).emit("receive-message", {
                    from,
                    message,
                });
            }

        })
        
        socket.on("disconnect",()=>{
            activeUserMap.delete(socket.userId)
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