import { connection } from "../database connections/databaseConnect.js";

const insertMessage= async (user1,user2,message)=>{
    //first find or create the conversation between the two people...
    var convoId;
    const[result]=await connection.query(`SELECT id FROM one_one_conversations
                            WHERE (user_one_id = ? AND user_two_id = ?)
                            OR (user_one_id = ? AND user_two_id = ?)`,[user1,user2,user2,user1]);

       if(!result.length){
            //insert into the conversation table...
            const[myData] = await connection.query(`INSERT INTO one_one_conversations (user_one_id, user_two_id)
                                    VALUES (LEAST(?, ?), GREATEST(?, ?));`,[user1,user2,user1,user2])
                if(myData.affectedRows===0){
                    throw new Error("Error inserting a conversation ");
                }

                await connection.query(`INSERT INTO ONE_ONE_LAST_MESSAGES (CONVERSATION_ID,MESSAGE,IS_READ,SENT_AT)
                                        VALUES(?,?,?,?)`,[myData.insertId,message,false,new Date()]);

                convoId= myData.insertId;
       }
       else{
        convoId=result[0].id;
       }

       const[{insertId,affectedRows}]=await connection.query(`INSERT INTO one_one_messages (conversation_id, sender_id, message)
                                VALUES (?, ?, ?)`,[convoId,user1,message]);
        if(affectedRows===0){
            throw new Error("Error in inserting user messages...")
        }

        const [data] = await connection.query(`UPDATE ONE_ONE_LAST_MESSAGES 
                                                SET MESSAGE = ?,
                                                    SENT_AT= ?
                                                WHERE CONVERSATION_ID = ?`,[message,new Date(),convoId]);
            if(data.affectedRows===0){
                throw new Error("Failed to update messages last")
            }
        return true;
}

const getConversationsList = async (roll_number)=>{

    const [results]=await connection.query(`SELECT * FROM one_one_conversations WHERE USER_ONE_ID = ?
                                            OR USER_TWO_ID`,[roll_number,roll_number]);

    let temp = [];
    for(let i=0;i<results.length;i++){
        let [lastMessage] = await connection.query(`SELECT MESSAGE,SENT_AT AS TIME FROM ONE_ONE_LAST_MESSAGES WHERE 
                                                   CONVERSATION_ID = ?`,[results[i].id]);
            if(lastMessage.length===0){
                console.log("That is so wiered how did that happen")
            }
            results[i].lastMessage=lastMessage[0].MESSAGE;
           results[i].time=lastMessage[0].TIME;
    }                                     
     
    return results;
}

// console.log(await getConversationsList(2305336));





// console.log(await insertMessage(2305336,2305333));
// console.log(await insertMessage(2305336,2305333,"Are you at College now ?"));



export {insertMessage,getConversationsList}