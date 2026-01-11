import express from "express";
import mysql from "mysql2/promise";
import session from "express-session";
import connectMySQL from "express-mysql-session";
import thirdSemResults from "../ThirdSemester.js";
import { DomainError } from "../Domain Errors/Grades Module Errors/domainErrors.js";
import "dotenv/config"
import { connect } from "http2";


const MySQLStore = connectMySQL(session);
let asyncConnect = async () => {
   
try {
     const connection = await new mysql.createPool({ 
    host: process.env.DB_HOST, 
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,     
    database:process.env.DB_NAME,
    // port: process.env.DB_PORT,
});

console.log("Database connnected successfully")
console.log("Database Credentials: ",process.env.DB_HOST,process.env.DB_USER,process.env.DB_PASSWORD,process.env.DB_NAME )

return connection;
} catch (error) {
    throw Error("Error connecting to the database:",error);
}

}

let connection = await asyncConnect();

const updateAttendanceSchema = async ()=>{
    const today = new Date();
    const weekDay= new Intl.DateTimeFormat("en-EN",{weekday:"long"}).format(today);
    const testingDate = "Tuesday";
    const [timetable_lookup]=await connection.query(`SELECT * FROM fifth_sem_timetable WHERE day_of_week = ?`,[weekDay]);
    // I will simulate a fake date for testing purposes...
    if(timetable_lookup.length){
        for(let i=0; i<timetable_lookup.length;i++){
            await connection.query(`INSERT INTO daily_lectures(timetable_id,lecture_date,start_time,end_time)
                                    VALUES(?,CURDATE(),?,?)`,[timetable_lookup[i].id,
                                    timetable_lookup[i].start_time,
                                    timetable_lookup[i].end_time,
                                ])
        }
    }
}
// updateAttendanceSchema()


const markAttendance = async (day,subject,roll_number,status,start_time,student_id,semester,classId)=>{
    // search the subject in subjects table (to get the subject_id) 
    console.log("Subject =>",subject)
    console.log("Class =>",classId)
    console.log("Semester =>",semester)
    const [search_result_id ]= await connection.query(`
        SELECT * FROM subjects
        WHERE name = ?
        AND class_id = ?
        and semester =?
        `,[subject,classId,semester]);
    if(!search_result_id.length){
        throw DomainError.invalid("Subject_not_found_in_the_database");
    }
    const subject_id = search_result_id[0].id;
    // Search the timetable_id in the fifth_sem_timetable table
    const [search_result_timetable] = await connection.query(`
        SELECT * FROM timetable_slots 
        WHERE subject_id = ? 
        AND day_of_week = ?
        AND class_id = ?
        AND semester = ?
        `,[subject_id,day,classId,semester]); 
    if(search_result_timetable.length === 0){
        throw DomainError.invalid(`No timetable found for this subject on the specified day; subject_id: ${subject_id}`);
    }
    // check if the student has already attended the lecture
    const [attendance_check] = await connection.query(`
        SELECT * FROM attendance 
        WHERE student_id = ? 
        AND subject_id = ? 
        AND start_time= ? 
        AND date = CURDATE()
        AND semester=?
        AND class_id = ?
        `,[student_id,subject_id,start_time,semester,classId]);
    if(attendance_check.length){
        throw new Error("You have already marked attendance for this lecture");
    }
    // insert the attendance
    const [attendance_insert] = await connection.query(`
        INSERT INTO attendance(user_id,subject_id,date,status,start_time,student_id,semester,class_id)
        VALUES(?,?,CURDATE(),?,?,?,?,?)`
        ,[roll_number,subject_id,status,start_time,student_id,semester,classId]);
    
    if(attendance_insert.affected_rows===0){
        throw new Error("Error marking attendance, please try again later");
    }
    return true; // attendance marked successfully

}

// await markAttendance("ERP",2305336,1);



const checkDB = async ()=>{
    const [result] = await connection.query(`SELECT
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
                        ORDER BY convo.id, msg.sent_at ASC;
        `,[2305336,2305336]) 
    console.log("These are  the students",result)
}
// await checkDB();
export const sessionStore= new MySQLStore({},connection);
const getFromUserName= async(rollNumber,password)=>{
    const [rows] = await connection.query("SELECT * FROM activated_accounts WHERE roll_number = ? ",[rollNumber])
    if (!rows.length){
        throw Error("No such user is found Looser")
    }
    if(rows[0].password !== password){
        throw Error("Incorrect Password")
    }
    return rows;
}
const getUserById = async (id)=>{
    const [rows] = await connection.query("SELECT * FROM all_students WHERE id = ? ",[id])
     if (!rows.length){
        throw Error("No such user is found")
    }
    return rows;
}
const getUserByIdDeserialize = async (user)=>{
    const [rows] = await connection.query("SELECT * FROM activated_accounts WHERE id = ? ",[user.id])
     if (!rows.length){
        // console.log('id=>',id)
        throw Error("No such user is found")
    }
    const user_id = rows[0].id
    const [role] = await connection.query(`SELECT r.name AS role_name
        FROM roles r
        JOIN user_roles ur ON ur.role_id = r.id
        WHERE ur.user_id=?   `,[user_id] );
    const user_roles = role.map((r)=>{
        return r.role_name
    });
    const result = {
        user_data:rows[0]
    }
    if(user_roles.includes("STUDENT")){
        const [class_details] = await connection.query(`
            SELECT c.*
            FROM student_class_enrollments e
            JOIN classes c ON c.id = e.class_id
            WHERE e.student_id = ?
            AND e.status = 'ACTIVE'`,
            [user.student_id])
        if(class_details.length){
            result.user_data.class_id= class_details[0].id
            result.user_data.semester=class_details[0].current_semester
        }
        const [more_student_details] = await connection.query(`
            SELECT student_name
            FROM all_students WHERE id = ?`, 
        [user.student_id]) 
        result.user_data.student_name = more_student_details[0].student_name
    }
    
    return result
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

// console.log("Student Results are : ",await getStudentResults("second_sem_result_collection",2305336))

const getStudentSemesterSubjects = async (semester)=>{
       const [result]= await connection.query(`SELECT *, name AS subject_name FROM subjects WHERE semester = ?`,[parseInt(semester)])
       if(!result.length){
        throw new Error("No Subjects Found")
       }
       return result;
}
const getStudentSemesterSubjectsById = async (semester,id)=>{
    
       const [result]= await connection.query(`SELECT *, name AS subject_name FROM subjects WHERE id = ? AND semester = ?`,[parseInt(id),parseInt(semester)])
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
        if(parseInt(roll_number)>2305340 && parseInt(roll_number)<2305370){
            throw new Error("Rollcall is not yet set for LEET students, please contact Thomas for more details. Thank you")
        }
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
            WHERE table_schema = "rollcall"
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

const getFollowersDetails = async (roll_number)=>{
    const [res]=await connection.query(`SELECT * FROM activated_accounts WHERE roll_number = ?`,[roll_number]);
    if(!res.length){
        throw new Error("Error in getting student following details")
    }
    return res
}

const getActivatedStudentsChats = async ()=>{
    const [result]=await connection.query(`SELECT 
                            act.roll_number,
                            act.followers,
                            b.profile_picture,
                            b.profile_picture_type,
                            b.student_name
                            FROM activated_accounts act
                            JOIN all_students b ON act.roll_number= b.roll_number`);
    if(!result.length){
        throw new Error("Failed getting activated users")
    }   
    return result                     
}
const getTimetable = async ()=>{
   
    const [result] = await connection.query(`
                    SELECT t.*, 
s.name AS subject_name,
s.subject_image,
s.code
FROM fifth_sem_timetable t
JOIN subjects s 
ON s.id = t.subject_id; `
                                        );

    if(!result.length){
        throw new Error("The time time table appears top be empty");
    }
    return result;
}


// console.log("My Activated users: ",await getTimetable())
export {connection,getUserByIdDeserialize,getStudentSemesterSubjectsById,getFromUserName,getUserById,getStudentResults,getStudentSemesterSubjects,getPassedFromSubject,getFailedFromSubject,createStudentAccount,addProfilePicture,retrieveProfile,enquireStudentPersonalInfo,addCredentials,getUserName,getAllStudents,getFollowersDetails,getActivatedStudentsChats,getTimetable,markAttendance}
