import express from "express";
import mysql from "mysql2/promise";
import session from "express-session";
import connectMySQL from "express-mysql-session";
import thirdSemResults from "../ThirdSemester.js";
import "dotenv/config"


const MySQLStore = connectMySQL(session);
let asyncConnect = async () => {
   
try {
     const connection = await new mysql.createPool(process.env.MYSQL_DATABASE);
    // host: process.env.DB_HOST, 
    // user:process.env.DB_USER,
    // password:process.env.DB_PASSWORD,     
    // database:process.env.DB_NAME,
    // port: process.env.DB_PORT,

return connection;
} catch (error) {
    throw Error("Error connecting to the database:");
}

}

let connection = await asyncConnect();

// console.log("Show me this: ", await connection.query(`SHOW FULL TABLES IN railway WHERE TABLE_TYPE = 'VIEW'`))


// const checkDB = async ()=>{
//     // await connection.query(`use railway`)
//     const [result] = await connection.query(`DELETE  FROM sessions`) 
//     console.log("These are  the students",result)
// }
// await checkDB();
export const sessionStore= new MySQLStore({},connection);


const getFromUserName= async(rollNumber,password)=>{
    const [rows] = await connection.query("SELECT * FROM activated_accounts WHERE roll_number = ? ",[rollNumber])
    if (!rows.length){
        throw Error("No such user is found")
    }
    // console.log("wiuei: ",rows[0])
    if(rows[0].password !== password){
        throw Error("Incorrect Password")
    }
    return rows;
}
const getUserById = async (id)=>{
    const [rows] = await connection.query("SELECT * FROM first_semester_students WHERE roll_number = ? ",[id])
     if (!rows.length){
        throw Error("No such user is found")
    }
    return rows;
}

const results = thirdSemResults.results;


const initialiseDB = async ()=>{
    const conn = await  connection.getConnection()
    try {
        await conn.query(`START TRANSACTION`)
        for(const student of results){
            //insert students into the students table
            const [studentResult] = await conn.execute(`
                INSERT INTO third_semester_students (roll_number,student_name,father_name,result_status,passed,credits,SGPA)
                VALUES(?,?,?,?,?,?,?)
                `,[
                    student.rollNumber,
                    student.studentName,
                    student.FatherName,
                    student.resultStatus,
                    student.passed,
                    student.credits,
                    student.SGPA
                ]);
                const studentId = studentResult.insertId;
                //insert each subject and corresponding grade... 
                for(const [subjectName,gradeInfo] of Object.entries(student.gradeDetails)){
                    //check if subject exist in the subject table or insert it 
                    let [subjectRow] = await conn.query(`SELECT subject_id FROM third_semester_subject WHERE subject_name = ?`,[subjectName]) 
                    var subId;
                    if(!subjectRow.length){
                        const  [subjectInsert] = await conn.execute(
                            `INSERT INTO third_semester_subject(subject_name)
                            VALUES(?)
                            `,[subjectName]
                        );
                        subId = subjectInsert.insertId;
                    }
                    else{
                        const {subject_id}= subjectRow[0];
                        subId = subject_id;
                    }

                    // insert grade
                    await conn.execute(
                        `
                        INSERT INTO third_semester_grades(student_id,subject_id,qualitative_meaning,grade_symbol,status)
                        VALUES(?,?,?,?,?)
                        `,
                        [
                            studentId,
                            subId,
                            gradeInfo.qualitative_meaning,
                            gradeInfo.gradeSymbol,
                            gradeInfo.status
                        ]
                    );
                }
                 await conn.query(`COMMIT`)
        }
         console.log("All Data Inserted Successfully...")
    } catch (error){
        console.error("Error Inserting Data",error)
    }
    finally{
        conn.release();
    }
}
//  await initialiseDB();

const getStudentResults = async (table,id)=>{
    const [results] = await connection.query(`SELECT * FROM ${table} WHERE roll_number = ?`,[id])
    if(!results.length){
        throw new Error("NO RECORDS FOUND");
    }
    return results;
}
const getStudentSemesterSubjects = async (semester_subjects_table)=>{
       const [result]= await connection.query(`SELECT * FROM ${semester_subjects_table}`)
       if(!result.length){
        throw new Error("No Subjects Found")
       }
       return result;
}

const getPassedFromSubject = async (sem_view,subject)=>{
    const [result] = await connection.query(`SELECT COUNT(${subject}) FROM ${sem_view}
         WHERE FIND_IN_SET("pass",${subject}) > ?`,[0]);
         if(!result.length){
            throw new Error("Error in communicating with the database...")
         }
        console.log("The result is ", result[0]['COUNT(Engineering_Physics)'])
        return result[0]
}

const getFailedFromSubject = async (sem_view,subject)=>{
       const [result] = await connection.query(`SELECT COUNT(${subject}) FROM ${sem_view}
         WHERE FIND_IN_SET("pass",${subject})= ? `,[0]);
         if(!result.length){
            throw new Error("Error in communicating with the database...")
         }
        console.log("The result is ", result[0]['COUNT(Engineering_Physics)'])
        return result[0]
}

const createStudentAccount = async (roll_number,password,confirm_password)=>{
    const myConn=await connection.getConnection();
    await myConn.query("START TRANSACTION")
    if(password !== confirm_password){
        throw new Error("Passwords do not match")
    }
    const [result] = await myConn.query(`SELECT * FROM activated_accounts WHERE roll_number = ?`,[roll_number])
    if(result.length){
        throw new Error("Account already exists for this roll number")
    }
    const [isExisting]= await myConn.query(`SELECT * FROM all_students WHERE roll_number = ?`,[roll_number]);
    if(isExisting.length===0){
        throw new Error("You are not authorised to create an account with this roll number")
    }
    const [inserted] = await myConn.query(`UPDATE all_students
                            SET password = ?
                            WHERE roll_number = ?`
        ,[password,roll_number])

     if(inserted.affectedRows===0){
        throw new Error("Error creating account, please try again later (inserting password)")
     }           
    const [insertedAccount] = await myConn.query(`INSERT INTO activated_accounts (roll_number,password)
                                VALUES(?,?)`,[roll_number,password]) 
                     
    if(insertedAccount.affectedRows===0){
        throw new Error("Error creating account, please try again later (inserting roll number)")
    }  
    console.log("Account created successfully for roll number: ",roll_number) 
    await myConn.query("COMMIT")
    myConn.release();
    return true; 
}   

const addProfilePicture = async (roll_number, filePath,type)=>{
    if(!filePath){
        console.log("File path is undefined here")
    }
    const [result] = await connection.query(`UPDATE all_students
        SET profile_picture = ?
        WHERE roll_number = ?`,[filePath,roll_number])
    if(result.affectedRows === 0){
        throw new Error("Error updating profile picture")
    }
    const [result2] = await connection.query(`UPDATE all_students
        SET profile_picture_type = ?
        WHERE roll_number = ?`,[type,roll_number])
        if(result2.affectedRows===0){
            throw new Error("Error Updating image type")
        }
    return true;
}
const retrieveProfile = async (roll_number)=>{
        const [result]=await connection.query(`SELECT profile_picture,profile_picture_type FROM all_students WHERE roll_number = ?`,[roll_number]);
        if(!result.length){
            throw new Error("No User Found")
        }
        return result;
}

const enquireStudentPersonalInfo= async (roll_number)=>{
     let [result0]=await connection.query(`SELECT EXISTS (
            SELECT 1
            FROM information_schema.views
            WHERE table_schema = "railway"
            AND table_name = "student_and_student_credentials"
        ) AS view_exists;`)
        //  console.log("Very Very Important ",result0)
         if(result0[0].view_exists==0){
                const [result] =await connection.query(`CREATE VIEW student_and_student_credentials AS
                                                        SELECT 
                                                        st.email_address,
                                                        st.phone_number,
                                                        st.semester,
                                                        st.admission_year,
                                                        st.date_of_birth,
                                                        st.department,
                                                        st.gender,
                                                        ac.roll_number
                                                        FROM student_credentials st
                                                        JOIN activated_accounts ac ON st.roll_number=ac.roll_number`)

        const [result1] = await connection.query(`SELECT * FROM student_and_student_credentials WHERE roll_number= ?`,[roll_number]);
        // console.log("myres",result1)
        const [done]= await connection.query(`DROP VIEW student_and_student_credentials`);
        if(!result1.length){
                return {status:false,value:null} //means no data of yours has ever even entered the credentials systems...
            }
            
        return {status:true,value:result1}; //some or all of your data has been entered in the credentials system...
    }
    else{
        console.log("View Aready Exists")
        const [done]= await connection.query(`DROP VIEW student_and_student_credentials`);

    }
}
//   console.log(await enquireStudentPersonalInfo(2305336))

const addCredentials= async (field,roll_number,data)=>{
    const [check] = await connection.query(`SELECT * FROM activated_accounts WHERE roll_number = ?`,[roll_number]);
    if(!check.length){
        throw new Error("User not activated")
    }
    const [check2] = await connection.query(`SELECT * FROM student_credentials WHERE roll_number = ?`,[roll_number]);
    if(!check2.length){
        //There is no entry in the table of such a student
        const [insertId] = await connection.query(`INSERT INTO student_credentials(roll_number,${field})
                                            VALUES(?,?)`,[roll_number,data]);
            if(insertId.affectedRows===0){
                throw new Error("Failed to insert values")
            }
            return true;
    }
    else{
        const [updateResult] = await connection.query(`UPDATE student_credentials 
                                                        SET ${field} = ? 
                                                        WHERE roll_number = ?`,[data,roll_number]);
            if(updateResult.affectedRows===0){
                throw new Error("Failed updating data")
            }
            return true
    }

}
//  console.log(await addCredentials("email_address",2305336,"thomasanesu@gmail.com"))

const getUserName= async (roll_number)=>{
        const [result]=await connection.query(`SELECT student_name FROM all_students WHERE roll_number = ? `,[roll_number]);
        if(!result.length){
            throw new Error("No user found");
        }
        return result;
}
const getAllStudents= async ()=>{
        const [result]= await connection.query(`SELECT * FROM all_students`);
        if(!result.length){
            throw new Error("Error in fetching data")
        }
        return result;
}








export {connection,getFromUserName,getUserById,getStudentResults,getStudentSemesterSubjects,getPassedFromSubject,getFailedFromSubject,createStudentAccount,addProfilePicture,retrieveProfile,enquireStudentPersonalInfo,addCredentials,getUserName,getAllStudents}
