import { connection } from "../../database connections/databaseConnect.js";
import e from "express";

const articleCommentsRouter = e.Router();

articleCommentsRouter.get("/get-comments/:id",async (req,res)=>{
    const articleId = req.params.id;
    try {
        const [comments]= await connection.query(`
        SELECT sc.id, sc.comment, sc.created_at,
            u.roll_number AS user_id, u.student_name AS user_name
     FROM study_comments sc
     JOIN all_students u ON sc.user_id = u.roll_number
     WHERE sc.article_id = ?
     ORDER BY sc.created_at DESC`,[articleId]) 
     res.status(200).json({status:true,data:comments})
    } catch (error) {
       console.error("Error in fetching comments",error) 
       res.status(500).json({status:false})
    }
});

articleCommentsRouter.post('/post-comment/:id',async (req, res) => {
    if(!req.user){
        res.status(500).json({status:false,data:"unauthorized"})
    }
    try {
        const { comment } = req.body;
        const article_id = req.params.id;
        const user_id = req.user.roll_number;
        await connection.query(
            'INSERT INTO study_comments (article_id, user_id, comment) VALUES (?,?,?)',
            [article_id, user_id, comment]
        );
        res.status(200).json({status:true,data:"comment posted successfully"})
    } catch (error) {
        console.error("Error posting comment...",error)
        res.status(500).json({status:false});
    }
});

// deleting comment
articleCommentsRouter.delete ("/delete-comment/:commentId",async (req,res)=>{
    if(!req.user){
        throw new Error("Unauthorized...")
    }
    try {
        const commentId = req.params.commentId;
        const userId = req.user.roll_number;
        const [[comment]] = await connection.query(
            'SELECT user_id FROM study_comments WHERE id = ?',
            [commentId]
        );
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        if (comment.user_id !== userId)  // Thomas should be able to delete all user comments later...
            return res.status(403).json({ message: "Unauthorized" });
        await connection.query('DELETE FROM study_comments WHERE id = ?', [commentId]);
        res.status(200).json({status:true, data:"comment deleted successfully"});
    } catch (error) {
        console.error("Error deleting comment",error)
        res.status(500).json({status:false})
    }
})

export default articleCommentsRouter;