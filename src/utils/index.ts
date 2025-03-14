
  /**
 * Extracts questions from a JSON resultset and transforms them into the required format
 * @param {string|Object} input - The JSON string or object containing the resultset
 * @returns {Array} - Array of questions in the format {question: String, answer: String}
 */
export const  extractQuestions =(input) =>{
    try {
      // Handle the input which could be a string or already an object
      let data;
      if (typeof input === 'string') {
        try {
          data = JSON.parse(input);
        } catch (e) {
          // Input might be a direct resultset string
          return extractQuestionsFromResultset(input);
        }
      } else if (typeof input === 'object') {
        data = input;
      } else {
        throw new Error("Input must be a JSON string or object");
      }
      
      // Check if data is directly the questions array
      if (Array.isArray(data) && data.length > 0 && data[0].hasOwnProperty('Q1')) {
        return transformQuestions(data);
      }
      
      // Extract the resultset - it could be a string or an object
      const resultset = data.resultset;
      
      if (!resultset) {
        throw new Error("No resultset found in the input");
      }
      
      return extractQuestionsFromResultset(resultset);
    } catch (error) {
      console.error("Error processing the JSON:", error);
      return [];
    }
  }
  
  /**
   * Extract questions from a resultset which could be a string or an object
   * @param {string|Object} resultset - The resultset containing questions
   * @returns {Array} - Formatted questions array
   */
  const extractQuestionsFromResultset =(resultset)=> {
    try {
      // The resultset could be a string that needs parsing or already an object
      let parsedResultset;
      if (typeof resultset === 'string') {
        try {
          parsedResultset = JSON.parse(resultset);
        } catch (e) {
          throw new Error("Invalid resultset JSON string");
        }
      } else if (typeof resultset === 'object') {
        parsedResultset = resultset;
      } else {
        throw new Error("Resultset must be a JSON string or object");
      }
  
      // Check if questions array exists
      if (!parsedResultset.questions || !Array.isArray(parsedResultset.questions)) {
        throw new Error("No questions array found in the resultset");
      }
      
      return transformQuestions(parsedResultset.questions);
    } catch (error) {
      console.error("Error processing resultset:", error);
      throw error; // Re-throw to be caught by the main function
    }
  }
  
  /**
   * Transform questions array into the required format
   * @param {Array} questions - Array of question objects
   * @returns {Array} - Formatted questions array
   */
  function transformQuestions(questions) {
    return questions.map(questionObj => {
      // Each question is an object with a single key (like Q1, Q2)
      const key = Object.keys(questionObj)[0];
      const questionText = questionObj[key];
      
      return {
        question: questionText,
        answer: "" // Empty answer as per the requested format
      };
    });
  }
  
  // Example usage:
  // const jsonInput = { "resultset": {"questions": [{"Q1": "Could you provide more details..."}, {"Q2": "Are there particular times..."}], "chat_uuid": "9df0bb52-3401-4b6f-b91b-39f2f90f521d", "code": "200", "token_count": "271"}, "status": "ok", "summary": "The JSON contains 4 main parts..." };
  // const questions = extractQuestions(jsonInput);
  // console.log(questions);
