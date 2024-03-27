/**
 * image-alt, color-contrast, link-name, html-has-lang, link-in-text-block, aria-required-attr,
 * landmark-unique, meta-viewport, region,
 *
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
    Correct the HTML for accessibility based on the WCAG 2.1 violation description below. Use the example below as a guide.

    *WCAG 2.1 violation description* : ${description}

    Example:
    Given Violation: <img src="image01.svg" alt="" class="h-6" data-v-014b54f2="">
    - Corrected HTML: <img src="image01.svg" alt="Jumia - Leading Africa e-commerce." class="h-6" data-v-014b54f2="">
    
    Given Violation: ${violationHtml}
    - Corrected HTML:  
    `;
    // CHAIN-OF-THOUGHT
  } else if (prompt_technique === "COT") {
    return `
    Correct the HTML for accessibility based on the WCAG 2.1 violation description below. Use the example below as a guide.

    *WCAG 2.1 violation description* : ${description}

    Example:
    Given Violation: '<img class="icon" src="https://fjord.dropboxstatic.com/SharedContentLight.svg">'
    - Thought: I need to identify the attached image function and context to create suitable alt-text. This image depicts a "magnifying glass" used for demonstrating the ease of tracking shared links.
    - Corrected HTML: '<img class="icon" src="https://fjord.dropboxstatic.com/SharedContentLight.svg" alt="A magnifying glass, demonstrating ease of tracking shared links.">'

    Given Violation: ${violationHtml}
    - Thought:
    - Corrected HTML:
    `;
    // ReAct Technique
  } else if (prompt_technique === "ReAct") {
    return `
      Correct the HTML for accessibility based on the WCAG 2.1 violation description below. Use the example below as a guide.

      *WCAG 2.1 violation description* : ${description}

      Example:
      Given Violation: '<img class="icon" src="https://fjord.dropboxstatic.com/SharedContentLight.svg">'
      - Thought: I need to identify the attached image function and context to create suitable alt-text.
      - Action: View[attached image].
      - Observation: This image depicts a "magnifying glass" used for demonstrating the ease of tracking shared links.
      - Thought: I should use the new knowledge about the image to add a concise Alt text to the HTML.
      - Action: add concise Alt text to HTML.
      - Corrected HTML: '<img class="icon" src="https://fjord.dropboxstatic.com/SharedContentLight.svg" alt="A magnifying glass, demonstrating ease of tracking shared links.">'

      Given Violation: ${violationHtml}
    `;
  }
}

function colorContrast(violationHtml, description, prompt_technique) {
  if (prompt_technique === "fewShot") {
    return `
    
    `;
    // CHAIN-OF-THOUGHT
  } else if (prompt_technique === "COT") {
    return `
    
    `;
    // ReAct Technique
  } else if (prompt_technique === "ReAct") {
    return `
      Correct the HTML for accessibility based on the WCAG 2.1 violation description below. Use the example below as a guide.

      Example:
      *WCAG 2.1 violation description* : Fix any of the following:\n  Element has insufficient color contrast of 4.41 (foreground color: #1e73be, background color: #f2f2f2, font size: 16.8pt (22.4px), font weight: normal). Expected contrast ratio of 4.5:1.
      Incorrect HTML: '<div class="row-bg viewport-desktop using-bg-color" style="background-color: #f2f2f2;"></div>'
      - Thought: I need to make sure the color contrast in the provided HTML matches complies with the required contrast of 4.5:1 as per WCAG 2.1 guidelines.
      - Observation: Since the contrast ratio is already at 4.41 with a foreground color of #1e73be (a medium blue) and a background color of #f2f2f2 (a very light grey), making a slight adjustment to the background color should achieve compliance without significantly altering the visual aesthetics of the website.
      - Thought: I should use this new insight to calculate a slightly darker shade of the current background color that would meet the required contrast ratio of 4.5:1.
      - Action: calculate a slightly darker shade of [#f2f2f2].
      - Thought: I got "#ededed" from the above calculation. I need to verify that the new background color combined with the foreground color meets the constrast ratio of 4.5:1.
      - Action: Calculate contrast between new background color ("#ededed") and foreground color (#1e73be) using WCAG contrast formula - contrast ratio = (L1 +0.05)/(L2 + 0.05).
      - Observation: From the calculation, I see that the new contrast ratio is 4.22:1 which does not comply with the required 4.5:1.
      - Thought: I need to choose a new color. I'll alter the foreground color (#1e73be) this time while keeping the old background color (#f2f2f2).
      - Action: Choose new foreground color that significantly enhances constrast.
      - Thought: The new foreground color is "#1c71bc". I need to verify that this new foreground color combined with initial background color (#f2f2f2) meets up to a contrast of 4.5:1.
      - Action: Calculate contrast between new foreground color ("#1c71bc") and background color (#f2f2f2) using WCAG contrast formula - contrast ratio = (L1 +0.05)/(L2 + 0.05).
      - Observation: This new combination meets the required contrast of 4.5:1.
      - Thought: I need to overrite the previous color using the style tag in the above HTML.
      Corrected HTML: '<div class="row-bg viewport-desktop using-bg-color" style="color: #1c71bc; background-color: #f2f2f2;"></div>
      '

      *WCAG 2.1 violation description* : ${description}
      Incorrect HTML: ${violationHtml}
    `;
  }
}

// TODO: GENERATE OTHER ACCESSIBILITY TYPES FUNCTIONS

// export function
module.exports.imageAltPrompt = imageAltPrompt;
