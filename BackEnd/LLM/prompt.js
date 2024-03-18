/**
 * Generates a prompt for correcting HTML based on the accessibility violation described.
 * Supports different techniques for prompting the model to generate a solution.
 *
 * Techniques:
 * - FEW SHOT (1-SHOT): Provides a single example (shot) of a correctly modified HTML element
 *   to guide the model in generating the correct output for a given accessibility violation.
 *
 * - ReAct Technique: Planned for future implementation. Intended to provide reactive prompts
 *   based on the context or previous interactions.
 *
 * - COT (Chain Of Thought): Planned for future implementation. Intended to guide the model
 *   through a logical reasoning process to arrive at the correct solution.
 *
 * @param {string} violationHtml The HTML snippet that contains the accessibility violation.
 * @param {string} description A description of the WCAG 2.1 violation to be addressed.
 * @param {string} prompt_technique The technique to use for generating the prompt.
 * @returns {string} The model response.
 */
function imageAltPrompt(violationHtml, description, prompt_technique) {
  // Handle the case for the FEW SHOT (1-SHOT) technique
  if (prompt_technique === "fewShot") {
    return `
    Return the correct “HTML” output for the accessibility violation description below.

    *WCAG 2.1 violation description* : ${description}
    
    *Example violation* : ‘<img src="image01.svg" alt="" class="h-6" data-v-014b54f2="">’
    
    *Example correct output* : ‘<img src="image01.svg" alt="Jumia - Leading Africa e-commerce." class="h-6" data-v-014b54f2="">’
    
    *Your task* : Correct the following violation based on the example above.
    
    *Violation* : ${violationHtml}
    
    *Correct output* :     
    `;
    // Placeholder for the ReAct technique
  } else if (prompt_technique === "ReAct") {
    return `
        NOT YET IMPLEMENTED!
    `;
    // Placeholder for the COT technique
  } else if (prompt_technique === "COT") {
    return `
        NOT YET IMPLEMENTED!
    `;
  }
}

// TODO: GENERATE OTHER ACCESSIBILITY TYPES FUNCTIONS

// export function
module.exports.imageAltPrompt = imageAltPrompt;
