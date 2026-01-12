import passport from "passport"
import Strategy from "passport-local"
import { getFromUserName,getUserById,getUserByIdDeserialize } from "../database connections/databaseConnect.js"


  passport.use(new Strategy(async (username,password,done)=>{
    console.log(`username: ${username}, password: ${password}`)
    try {
        let row = await getFromUserName(username,password);
        if(!row.length) throw new Error("Bad Credentials...");
        done(null,row[0])
    } catch (error) {
        done(error,null)
    }
}))

passport.serializeUser((user,done)=>{
    console.log("From the serialise...",user)
    done(null,user);
})
passport.deserializeUser(async (user,done)=>{
    try {
        // console.log("This is inside the desirialize user=>attempt",user)
        //  const row = await getUserById(user.student_id);
        const result = await getUserByIdDeserialize(user);

        //  if(!row.length) 
        //     throw new Error("No Matching User...")
        console.log("The user from database is :",result)
        done(null,result.user_data)
    } catch (error) {
        done(error,null)
    }
})
