import { connection } from "../../database connections/databaseConnect.js";

// Add a solution
export const addSolution = async (req, res) => {
  try {
    const { question_id, solution_number, solution_html, is_default } = req.body;
    console.log("my request body was: ",req.body);
    const [result] = await connection.query(
      `INSERT INTO assignment_solutions (question_id, solution_number, solution_html, is_default) 
       VALUES (?, ?, ?, ?)`,
      [question_id, solution_number, solution_html, is_default || false]
    );

    res.status(201).json({ success: true, insertedId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all solutions for a question
export const getSolutionsByQuestion = async (req, res) => {
  try {
    const { question_id } = req.params;

    const [solutions] = await connection.execute(
      `SELECT * FROM assignment_solutions WHERE question_id = ? ORDER BY solution_number ASC`,
      [question_id]
    );

    res.json({ status: true, data:solutions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update a solution
export const updateSolution = async (req, res) => {
  try {
    const { id } = req.params;
    const { solution_html, is_default } = req.body;

    const [result] = await connection.execute(
      `UPDATE assignment_solutions SET solution_html = ?, is_default = ? WHERE id = ?`,
      [solution_html, is_default, id]
    );

    res.json({ success: true, affectedRows: result.affectedRows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete a solution
export const deleteSolution = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await connection.execute(
      `DELETE FROM assignment_solutions WHERE id = ?`,
      [id]
    );

    res.json({ success: true, affectedRows: result.affectedRows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};