import { connection } from "../../database connections/databaseConnect.js";


export const StudyArticleModel = {
  async create(article) {
    const sql = `
      INSERT INTO study_articles
        (title, slug, summary, content_html, content_delta, author_id, subject_id, thumbnail_url, published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      article.title,
      article.slug,
      article.summary || null,
      article.content_html || null,
      JSON.stringify(article.content_delta || null),
      article.author_id,
      article.subject_id || null,
      article.thumbnail_url || null,
      article.published ? 1 : 0
    ];
    const [result] = await connection.query(sql, params);
    return { id: result.insertId, ...article };
  },

  async findById(id) {
    const [rows] = await connection.query(`
      SELECT 
      s.id,
      s.title,
      s.slug,
      s.summary,
      s.content_html,
      s.content_delta,
      s.author_id,
      s.subject_id,
      s.thumbnail_url,
      s.published,
      s.created_at,
      s.updated_at,
      a.student_name AS author,
      f.subject_name AS subject 
      FROM study_articles s
      JOIN all_students a ON s.author_id = a.roll_number
      JOIN fifth_sem_subjects f ON s.subject_id = f.id
      
      HAVING id = ?`, [id]);
    if (!rows.length) return null;
    const row = rows[0];
    row.content_delta = row.content_delta ? JSON.parse(row.content_delta) : null;
    return row;
  },

  async findAll({ limit = 50, offset = 0 } = {}) {
    const [rows] = await connection.query(
      `SELECT a.id, a.title, a.slug, a.summary, a.thumbnail_url,a.published,s.student_name as author,f.subject_name as subject, a.created_at 
      FROM study_articles a
      JOIN all_students s ON a.author_id = s.roll_number
      JOIN fifth_sem_subjects f ON a.subject_id = f.id
      ORDER BY created_at DESC LIMIT ? OFFSET ?`,

      [Number(limit), Number(offset)]
    );
    return rows;
  },
  async findAllByAuthor(authorId) {
   
      try {
         const [rows] = await connection.query(
      `
      SELECT a.id, a.title, a.slug, a.summary, a.thumbnail_url,a.published,s.student_name as author,f.subject_name as subject, a.created_at 
      FROM study_articles a
      JOIN all_students s ON a.author_id = s.roll_number
      JOIN fifth_sem_subjects f ON a.subject_id = f.id
      WHERE a.author_id = ?
      ORDER BY a.created_at`,
      [parseInt(authorId)]
    
    );
    return rows;
      } catch (error) {
        console.error("Error in findAllByAuthor:", error);
      }
  },
  async findAllWithBody({ limit = 20, offset = 0 } = {}) {
    const [rows] = await connection.query(
      'SELECT * FROM study_articles ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [Number(limit), Number(offset)]
    );
    return rows;
  },

  async update(id, article) {
    // chenge slug before updating to avoid duplicate slug error
    const slugChange = await connection.query(`UPDATE study_articles
      SET slug = ? WHERE id = ?`,["to-be-changed",id]);
    const sql = `
      UPDATE study_articles
      SET title = ?, slug = ?, summary = ?, content_html = ?, content_delta = ?, subject_id = ?, thumbnail_url = ?, published = ?
      WHERE id = ?
    `;
    const params = [
      article.title,
      article.slug,
      article.summary || null,
      article.content_html || null,
      JSON.stringify(article.content_delta || null),
      article.subject_id || null,
      article.thumbnail_url || null,
      article.published ? 1 : 0,
      id
    ];
    await connection.query(sql, params);
    return this.findById(id);
  },

  async remove(id) {
    await connection.query('DELETE FROM study_articles WHERE id = ?', [id]);
    return true;
  }
};
