
  /**
 * Extracts questions from a JSON resultset and transforms them into the required format
 * @param {string|Object} input - The JSON string or object containing the resultset
 * @returns {Array} - Array of questions in the format {question: String, answer: String}
 */
export const  extractQuestions =(input:any) =>{
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
  const extractQuestionsFromResultset =(resultset:any)=> {
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
  function transformQuestions(questions:any) {
    return questions.map((questionObj:any) => {
      // Each question is an object with a single key (like Q1, Q2)
      const key = Object.keys(questionObj)[0];
      const questionText = questionObj[key];
      
      return {
        question: questionText,
        answer: "" // Empty answer as per the requested format
      };
    });
  }
  
  export const  extractStakeholders =(response:any) =>{
    // Parse the resultset string into a JSON object
    const parsedResultset = JSON.parse(response?.resultset);

    // Extract and transform stakeholders
    return parsedResultset?.stakeholders?.map((stakeholder:any) => ({
        role: stakeholder.role,
        feedback: stakeholder.assessment,
        concerns: stakeholder.concerns,
        opportunities: stakeholder.opportunities,
        name: stakeholder.role
    }));
  }

  export const  extractClarifyingQiestions =(response:any) =>{
    // Parse the resultset string into a JSON object
    const parsedResultset = JSON.parse(response.resultset);

    return parsedResultset.clarifying_questions.map((question:any) =>({
      question,
      answer:''
    }))
  }

  export const  extractEvaluationData =(response:any) =>{
    // Parse the resultset string into a JSON object
    const parsedResultset = JSON.parse(response.resultset);

    return {
      "pros": parsedResultset.pros, 

      "cons": parsedResultset.cons, 

      // "impact_percentage": parsedResultset.impact_percentage, 
      // "feasibility_percentage": parsedResultset.feasibility_percentage, 
      // "ambiguity_percentage": parsedResultset.ambiguity_percentage
    }

  }

  export const  extractClarifierData =(response:any) =>{
    // Parse the resultset string into a JSON object
    const parsedResultset = JSON.parse(response.resultset);

    const applicableTrends = parsedResultset.applicable_trends.map((item:any) => ({
      trend: item.trend,
      application: item.application
    }));
  
    // Extract alternative implementations
    const alternativeImplementations = parsedResultset.alternative_implementations;

    return applicableTrends
  }
  export const  extractForIdeasData =(response:any,methodology:any,projectId:any) =>{
    // Parse the resultset string into a JSON object
    const parsedResultset = JSON.parse(response.resultset);

    const ideas = parsedResultset.ideas.map((item:any) => ({
      title: item.idea,
      description: item.description,
      isAiGenerated:true,
      methodology,
      projectId
    }));
  
    return ideas
  }
  export const  extractForNeedsData =(response:any,projectId:any,userId:any) =>{
    // Parse the resultset string into a JSON object
    const parsedResultset = JSON.parse(response.resultset);

    const needs = parsedResultset.needs.map((item:any) => ({
      need: item.name,
      reason: item.goal,
      isAiGenerated:true,
      projectId,
      userId
    }));
  
    return needs
  }
  export const  extractStoryboardData =(response:any) =>{
    // Parse the resultset string into a JSON object
    const parsedResultset = JSON.parse(response.resultset);

    const scenes = parsedResultset.scenes.map((item:any) => ({
      title: item.title,
      description: item.description,
      notes:"",
    }));
  
    return scenes
  }