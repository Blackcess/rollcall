import e from "express";
import { connection } from "../../database connections/databaseConnect.js";
import { getConversationsList } from "../../Live ChatDB_API/liveChatDBFunctions.js";
import { getChats } from "../../Chat Sockets/ChatSockets.js";
const convoListRouter = e.Router();
convoListRouter.get("/userChats",async (req,res)=>{
   
    try {
        const userId = req.user.roll_number;
        if(!userId){
            throw new Error("User not authenticated")
        }
        const conversationList = await getChats(userId);
        console.log("Chats are : ",conversationList)
        res.status(200).json({status:true,data:conversationList})  
    } catch (error) {
        console.error(error);
        res.status(500).json({status:false,message:"Error fetching conversation list"})
    }
})

export {convoListRouter}
