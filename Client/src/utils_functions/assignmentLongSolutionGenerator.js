import axios from 'axios';
/**
 * Generates an academic-style HTML solution for a long question.
 * @param {string} question - The question text.
 * @param {string} concept - The main concept or topic of the question.
 * @param {string[]} keyPoints - An array of key ideas or sections.
 * @param {string} explanation - The main detailed explanation.
 * @param {string[]} examples - A few illustrative examples.
 * @param {string[]} references - Optional reference list.
 * @returns {string} HTML string formatted using the long-solution template.
 */
export function generateLongSolutionHTML(question, concept, keyPoints, explanation, examples, references = []) {
  const keyPointsHTML = keyPoints.map(point => `
    <div class="solution-section">
      <h4>${point.title}</h4>
      <p>${point.content}</p>
    </div>
  `).join('');

  const examplesHTML = examples.length
    ? `
      <div class="solution-section">
        <h4>Illustrative Examples</h4>
        ${examples.map(ex => `<p>${ex}</p>`).join('')}
      </div>
    `
    : '';

  const referencesHTML = references.length
    ? `
      <div class="solution-references">
        <h4>References</h4>
        <ul>
          ${references.map(ref => `<li>${ref}</li>`).join('')}
        </ul>
      </div>
    `
    : '';

  return `
    <div class="long-solution">
      <h3>Answer: ${question}</h3>

      <div class="solution-intro">
        <h4>Introduction</h4>
        <p>The concept of <strong>${concept}</strong> plays a crucial role in software engineering. 
        This section introduces the key idea before diving into deeper aspects.</p>
      </div>

      ${keyPointsHTML}

      <div class="solution-section">
        <h4>Detailed Explanation</h4>
        <p>${explanation}</p>
      </div>

      ${examplesHTML}

      <div class="solution-conclusion">
        <h4>Conclusion</h4>
        <p>In conclusion, understanding <strong>${concept}</strong> helps students connect theoretical 
        foundations with real-world software engineering practices.</p>
      </div>

      ${referencesHTML}
    </div>
  `;
}


// add solutions manually---
// const API_BASE_URL = process.env.REACT_APP_API_URL;
// console.log("API BASE URL: ",API_BASE_URL);


  const handleSubmit = async () => {
    
    // setIsModalOpen(false);
    // Generate HTML using utility function
    const solutionHTML = generateLongSolutionHTML(
      // question,
      // concept,
      // keyPoints,
      // explanation,
      // examples,
      // references
      
  "What are regular expressions? List any five metacharacters used in Python’s re module with examples.",
  "Regular Expressions in Python (re module)",
  [
    {
      "title": "1. Definition and Purpose",
      "content": "<p>Regular Expressions (<code>regex</code> or <code>regexp</code>) are sequences of characters that define search patterns. They are mainly used for <strong>pattern matching</strong> and text manipulation — such as searching, replacing, extracting, and validating specific text patterns within strings. Python provides the built-in <code>re</code> module to work with regular expressions.</p>"
    },
    {
      "title": "2. Example Illustration",
      "content": "<div class='example-illustration'><h4>Example</h4><code>re.findall(r'world$', 'Python world')</code> → ['world']</div>"
    },
    {
      "title": "3. Importance of Regular Expressions",
      "content": "<ul><li>Parse large text data efficiently</li><li>Validate inputs (e.g. emails)</li><li>Extract structured info using concise patterns</li></ul>"
    }
  ],
  "Regular expressions provide a compact, powerful, and efficient way to identify complex string patterns in text.",
  [
    "For instance, validating an email pattern using <code>re.match(r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$', email)</code> ensures structured input.",
    "In text mining, <code>re.findall(r'\\d+', text)</code> can quickly extract all numeric data from large datasets."
  ],
  [
    "Python Documentation: https://docs.python.org/3/library/re.html",
    "Regular Expressions Cookbook — O'Reilly Media"
  ]


    );
    // console.log("Generated HTML String: ",solutionHTML);


    try {
      await axios.post(`http://192.168.1.6:8000/assignments/solution/add`, {
        question_id: 32,
        solution_number: 2,
        solution_html: solutionHTML,
        is_default: false,
      },{
        withCredentials: true
      });
      // alert("Solution added successfully!");
      console.log("Solution added successfully!");
      // if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      // alert("Failed to add solution");
      console.log("Failed to add solution");
    }


  };
  
// const API_BASE_URL = process.env.REACT_APP_API_URL || "http://rollcall";
// console.log(API_BASE_URL)


  const html = `<img src="http://192.168.1.4:8000/uploads/2305320-1761938619465.avif">`
  export function patchImageUrls(html, baseUrl){
  if (!html) return html;
  // Matches: src="http://anything/uploads/filename"
  return html.replace(
    /src="https?:\/\/[^"]+\/uploads\//g,
    `src="${baseUrl}/uploads/`
  );
}
// console.log("New IMG is", patchImageUrls(html,API_BASE_URL))
   // handleSubmit()