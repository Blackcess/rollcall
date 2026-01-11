import express from 'express';
import {
  createArticle,
  getArticle,
  listArticles,
  updateArticle,
  deleteArticle,
  getAllArticles,
  listArticlesByAuthor
} from '../../Data Controllers/Study Articles Controllers/studyArticlesController.js';
// import { createArticle } 


const studyArticleRouter = express.Router();

studyArticleRouter.get('/', listArticles);
studyArticleRouter.get('/findByAuthor', listArticlesByAuthor);
studyArticleRouter.get('/all', getAllArticles);
studyArticleRouter.get('/:id', getArticle);
studyArticleRouter.post('/', createArticle);
studyArticleRouter.put('/:id', updateArticle);
studyArticleRouter.delete('/:id', deleteArticle);

export default studyArticleRouter;
