import { StudyArticleModel } from '../../Data Models/Study Articles Module Models/studyArticlesModel.js';
import { sanitizeHtml } from '../../utils/helpers/sanitizeHTML.js';
import slugify from 'slugify';

export const createArticle = async (req, res) => {
  try {
    const { title, summary, content_html, content_delta, subject_id, published,thumbnail_url} = req.body;
    const author_id = req.user?.roll_number || req.body.author_id || null; // require auth ideally

    if (!title) return res.status(400).json({ message: 'Title required' });

    const sanitizedHtml = content_html ? sanitizeHtml(content_html) : null;
    const slug = slugify(title, { lower: true, strict: true }).slice(0, 220);

    const article = {
      title,
      slug,
      summary,
      content_html: sanitizedHtml,
      content_delta: content_delta ? JSON.parse(content_delta) : null,
      author_id,
      subject_id: subject_id || null,
      published: published ? 1 : 0,
      thumbnail_url
    };

    const created = await StudyArticleModel.create(article);
    res.status(201).json({ success: true, article: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Create failed' });
  }
};

export const getArticle = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const article = await StudyArticleModel.findById(parseInt(id));
    if (!article) return res.status(200).json({status:true, message: 'Not found' });
    res.json({ status: true, data:article });
  } catch (err) {
    console.error(err);
    res.status(500).json({status:false, message: 'Fetch failed' });
  }
};

export const listArticles = async (req, res) => {
  
  try {
    const { limit = 20, offset = 0 } = req.query;
    const rows = await StudyArticleModel.findAll({ limit, offset });
    res.json({ status: true, data: rows });
  } catch (error) {
    console.error(err);
    res.status(500).json({status:false, message: 'Fetch failed' });
  }
};
export const listArticlesByAuthor = async (req, res) => {
  if(!req.user){
    return res.status(401).json({status:false, message: 'Unauthorized' });
  }
  try {
    // const { limit = 20, offset = 0 } = req.query;
    const rows = await StudyArticleModel.findAllByAuthor(req.user.roll_number);
    res.json({ status: true, data: rows });
  } catch (error) {
    console.error(err);
    res.status(500).json({status:false, message: 'Fetch failed' });
  }
};
export const getAllArticles = async (req, res) => {
  
  try {
    const { limit = 20, offset = 0 } = req.query;
    const rows = await StudyArticleModel.findAllWithBody({ limit, offset });
    res.json({ status: true, data: rows });
  } catch (error) {
    console.error(err);
    res.status(500).json({status:false, message: 'Fetch failed' });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const body = req.body;
    if (body.content_html) body.content_html = sanitizeHtml(body.content_html);
    if (body.content_delta && typeof body.content_delta === 'string') body.content_delta = JSON.parse(body.content_delta);

    const updated = await StudyArticleModel.update(id, body);
    res.json({ success: true, article: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await StudyArticleModel.remove(id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({success:false, message: 'Delete failed' });
  }
};
