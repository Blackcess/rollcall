import { connection } from "../../database connections/databaseConnect.js";
import e from "express";

const articleLikesRouter = e.Router();

// like a post:
articleLikesRouter.post("/like/:id/:roll_number",async (req,res)=>{
    // if(!req.user){
    //   // console.log(req.user.roll_number)
    //     throw new Error("Unauthorized to like")
    // }
    try {
        const article_id = req.params.id;
        // const user_id = req.user.roll_number;
        const user_id = req.params.roll_number;
        await connection.query(
            'INSERT INTO study_likes (article_id, user_id) VALUES (?,?)',
            [article_id, user_id]
        );
        res.json({status:true, message: "Liked" });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY')
        return res.status(400).json({status:false, message: "Already liked" });
        console.error("Error liking post",error)
        res.status(500).json({status:false})
    }
})


// unlike an article
articleLikesRouter.post('/unlike/:id/:roll_number', async (req, res) => {
    // if(!req.user){
        // throw new Error("Unathourized. Create an account to contnue...")
    // }
  try {
    const article_id = parseInt(req.params.id);
    // const user_id = req.user.roll_number;
    const user_id = req.params.roll_number;
    await connection.query(
        'DELETE FROM study_likes WHERE article_id = ? AND user_id = ?',
        [article_id, user_id]
    );
    res.status(200).json({status:true, message: "Unliked" });
  } catch (error) {
    console.error("Error unliking an article",error)
    res.status(500).json({status:false})
  }
});

// get like status
articleLikesRouter.get('/like-status/:id', async (req, res) => {
  if(!req.user){
    console.log("request parameters",req.user)
    throw new Error("You are not Authourizedd")
  }
  try {
    const article_id = req.params.id;
    const user_id = req.user.roll_number;
    const [[row]] = await connection.query(
        'SELECT id FROM study_likes WHERE article_id = ? AND user_id = ?',
        [article_id, user_id]
    );
    res.status(200).json({status:true, liked: !!row });
  } catch (error) {
    console.error("Error checking like status",error)
    res.status(500).json({status:false})
  }
});

// get article metrics
articleLikesRouter.get('/study-articles/:id/metrics', async (req, res) => {
  try {
    const article_id = req.params.id;
    const [[result]] = await connection.query(
    `SELECT 
        (SELECT COUNT(*) FROM study_likes WHERE article_id = ?) AS likes_count,
        (SELECT COUNT(*) FROM study_comments WHERE article_id = ?) AS comments_count`,
    [article_id, article_id]
  );
  res.status(200).json({status:true,data:result});
  } catch (error) {
    console.error("Error checking metrics status",error)
    res.status(500).json({status:false})
  }
});

export default articleLikesRouter;