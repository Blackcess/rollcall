import { connection } from "../../database connections/databaseConnect.js";

const getSyllabusBySubjectName = async (req, res) => {
    const { subject } = req.query;

    try {
        const [rows] = await connection.query(`
 SELECT 
    s.id as subject_id,
    s.subject_name,
    sm.module_number,
    sm.module_title,
    mt.topic_title,
    mt.id as topic_id,
    co.co_code,
    co.description
FROM fifth_sem_subjects s
JOIN subject_modules sm 
    ON s.id = sm.subject_id
LEFT JOIN module_topics mt 
    ON sm.id = mt.module_id
LEFT JOIN module_course_outcome mco 
    ON sm.id = mco.module_id
LEFT JOIN course_outcomes co 
    ON mco.co_id = co.id
WHERE s.subject_name = ?
ORDER BY sm.module_number, mt.id;
        `, [subject]);

        console.log("Shoom: ",rows)
        

        // Optional: transform into JSON hierarchy
        const syllabus = {};
        rows.forEach(row => {
            if (!syllabus[row.module_number]) {
                syllabus[row.module_number] = {
                    module_number: row.module_number,
                    module_title: row.module_title,
                    hours: row.hours,
                    topics: [],
                    course_outcomes: []
                };
            }
            if (row.topic_title && !syllabus[row.module_number].topics.find(t => t.topic_title === row.topic_title)) {
                syllabus[row.module_number].topics.push({ id: row.topic_id, title: row.topic_title });
            }
            if (row.co_code && !syllabus[row.module_number].course_outcomes.find(c => c.code === row.co_code)) {
                syllabus[row.module_number].course_outcomes.push({ code: row.co_code, description: row.description });
            }
        });
        
        res.json({status:true,data:{
            subject_id: rows[0]?.subject_id || null,
            subject_name: subject,
            modules: Object.values(syllabus)
        }});

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error',status:false});
    }
};

export { getSyllabusBySubjectName };
