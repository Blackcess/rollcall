// import { httpServer } from "../src/server.js";
import { getConversationsList,insertMessage } from "../Live ChatDB_API/liveChatDBFunctions.js";
import { connection } from "../database connections/databaseConnect.js";


const mySocketLogic = (io)=>{
    let activeUserMap = new Map(); 

    io.use((socket,next)=>{
        const userId = socket.handshake.auth.userId;
        // console.clear()
        // console.log("User is ",socket.handshake.auth.userId);
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
            //  console.log("Active users are: ",activeUserMap)
            const [messages] = await connection.query(`SELECT
                        convo.id AS conversation_id,
                        convo.user_one_id,
                        convo.user_two_id,
                        msg.id AS message_id,
                        msg.sender_id,
                        msg.message,
                        msg.sent_at
                        FROM one_one_conversations AS convo
                        JOIN one_one_messages AS msg
                        ON convo.id = msg.conversation_id
                        WHERE convo.user_one_id = ? OR convo.user_two_id = ?
                        ORDER BY convo.id, msg.sent_at ASC`, [socket.userId,socket.userId]);
             
                const filtered= messages.filter(rows=>rows.user_one_id===Math.min(parseInt(socket.userId),parseInt(to)) && rows.user_two_id===Math.max(parseInt(socket.userId),parseInt(to)))
            // console.log(`Messages between ${socket.userId} amd ${to}: `,filtered)
            // io.to(to).emit("missed-messages", {data:messages});
            callback(filtered)
        });
        //user client emits this when they send a message
        socket.on("chat-message",async ({to,message})=>{
            //  console.log("Active users are: ",activeUserMap)
            const from = socket.userId;
            //send the message to the database...
            await insertMessage(from,to,message);
            //send to receipiant if receipiant is online
            const receipiant = activeUserMap.get(parseInt(to));
            // console.log(typeof("Receipiant Test Result",receipiant))
            if(receipiant){
                  io.to(receipiant).emit("receive-message", {
                    from,
                    message,
                    sent_at:new Date()
                });
                // console.log(`You sent a message to ${to} and he/she is online`)
            }
            else{
                // console.log(`You sent a message to ${to} and he/she is offline`)
            }

        })
        
        socket.on("disconnect",()=>{
            activeUserMap.delete(socket.userId)
            console.log(socket.userId, "is disconnected")
        })
    })
    console.log("Active users are: ",activeUserMap)
    
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

export {mySocketLogic, getChats}