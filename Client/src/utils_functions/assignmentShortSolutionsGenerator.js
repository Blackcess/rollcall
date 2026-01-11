// utils/generateShortSolution.js

/**
 * Generates a short-answer HTML template for assignments.
 *
 * @param {Object} data - The input data for the solution.
 * @param {string} data.question - The question text.
 * @param {string} data.concept - The main concept or topic of the question.
 * @param {string} data.definition - A short definition or direct answer.
 * @param {string} data.explanation - A brief elaboration or description.
 * @param {string[]} [data.keywords=[]] - Optional list of keywords.
 * @returns {string} HTML string formatted for MySQL storage.
 */

export function generateShortSolution(data) {
  const { question, concept, definition, explanation, keywords = [] } = data;

  const html = `
    <div class="short-solution">
      <div class="solution-header">
        <h4 class="question-title">${question}</h4>
      </div>

      <div class="solution-body">
        <p><strong>Concept:</strong> ${concept}</p>
        <p><strong>Definition:</strong> ${definition}</p>
        <p><strong>Explanation:</strong> ${explanation}</p>
      </div>

      <div class="solution-footer">
        <p class="keywords"><strong>Keywords:</strong> ${keywords.join(', ')}</p>
      </div>
    </div>
  `;

  return html.trim();
}
