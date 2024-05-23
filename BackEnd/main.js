// Import required modules and functions
const puppeteer = require("puppeteer");
const {
  runAxeCoreAnalysis,
} = require("./RunAccessibilityTest/runAxeCoreAnalysis");
const {
  saveAsJSON,
  extractDomainFromURL,
  extractHtmlElement,
} = require("./Operations/operations");
const { generateAccessibilityPrompt } = require("./LLM/prompt");
const { promptGPT } = require("./LLM/GPT");
const { promptClaude } = require("./LLM/Claude");

/**
 * Performs an accessibility analysis on a web page and attempts to correct violations
 * using the specified language model and technique.
 *
 * @param {string} url The URL of the web page to analyze.
 * @param {string} accessibility_type The type of accessibility violation to focus on (e.g., "image-alt").
 * @param {string} prompt_technique The technique used to generate prompts for the language model.
 * @param {number} temperature The temperature setting for the language model.
 * @param {string} model The language model used for accessibility repair (e.g., "GPT-3").
 */
async function runAnalysis(
  url,
  accessibility_type,
  prompt_technique,
  temperature,
  model
) {
  console.log(`Started experiment for: ${url}`);
  const analysisResult = []; // Initialize array to store the analysis results

  // Launch a new browser instance using Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage(); // Open a new page in the browser
  await page.goto(url); // Navigate to the specified URL

  const textContent = await page.evaluate(() => {
    // List of tags typically containing significant text content
    const textTags = ["p", "div", "h1", "h2", "h3", "h4", "h5", "h6", "li"];
    for (let tag of textTags) {
      const element = document.querySelector(tag);
      if (element && element.textContent.trim().length > 0) {
        let words = element.textContent.trim().split(/\s+/);
        if (words.length > 5) {
          words = words.slice(0, 5);
        }
        return words.join(" ");
      }
    }
    return "";
  });

  // Run Axe-core analysis to check for accessibility violations before making any modifications
  const axeResultsBeforeModification = await runAxeCoreAnalysis(
    page,
    accessibility_type
  );

  // Save the entire Axe Core report before any modifications to a JSON file
  await saveAsJSON(
    JSON.stringify(axeResultsBeforeModification, null, 2),
    `${extractDomainFromURL(
      url
    )}_${accessibility_type}_axe_report_before_repair`,
    `${extractDomainFromURL(
      url
    )}_${accessibility_type}_${prompt_technique}_${model}_${temperature}`
  );

  // Count the number of accessibility violations found
  const violationsBeforeModification =
    axeResultsBeforeModification.violations.length;

  // Proceed if any violations are found
  if (violationsBeforeModification > 0) {
    // Store initial analysis details and the count of violations before modification
    analysisResult.push({
      analysisDetails: [
        { model: model },
        { accessibility_type: accessibility_type },
        { prompt_technique: prompt_technique },
        { temperature: temperature },
      ],
      accessbilityTestResult: {
        violationBeforeModification: 0, // Initially set to 0; will be updated later
        violationAfterModification: 0, // Initially set to 0; will be updated later
      },
      modelCorrections: [], // Initialize an array to store corrections made by the model
    });

    // Iterate through each violation and its corresponding nodes
    for (const result of axeResultsBeforeModification.violations) {
      for (const node of result.nodes) {
        const selector = node.target[0]; // CSS selector of the offending element
        const beforeModification = node.html; // HTML of the element before modification

        // increament violationBeforeModification by 1 for each error encountered
        analysisResult[0].accessbilityTestResult.violationBeforeModification += 1;

        // Generate a solution using GPT based on the provided prompt technique and temperature
        let solution;
        const extractedText = textContent;

        if (model === "GPT") {
          solution = await promptGPT(
            generateAccessibilityPrompt(
              accessibility_type,
              node.html,
              node.failureSummary,
              prompt_technique,
              extractedText
            ),
            temperature
          );
        } else if (model === "Claude") {
          solution = await promptClaude(
            generateAccessibilityPrompt(
              accessibility_type,
              node.html,
              node.failureSummary,
              prompt_technique,
              extractedText
            ),
            temperature
          );
        }
        const extractedHTMLFromLLM = extractHtmlElement(solution);

        // Store the before and after modification states
        analysisResult[0].modelCorrections.push({
          beforeModification: beforeModification,
          afterModification: extractedHTMLFromLLM,
          rawOutput: solution,
        });

        // Replace the faulty HTML with LLM solution
        await page.evaluate(
          ({ item, correctedHTML }) => {
            const element = document.querySelector(item);
            if (
              element &&
              element.parentNode &&
              element.parentNode.nodeType === Node.ELEMENT_NODE
            ) {
              element.outerHTML = correctedHTML;
            } else if (element.nodeName === "HTML") {
              const langPattern = /lang=["']([^"']*)["']/;
              const match = langPattern.exec(correctedHTML);
              const value = match ? match[1] : "";
              element.setAttribute("lang", value);
            }
          },
          { item: selector, correctedHTML: extractedHTMLFromLLM }
        );
      }
    }

    // Re-run Axe-core analysis after modifications to check for resolved violations
    const axeResultsAfterModification = await runAxeCoreAnalysis(
      page,
      accessibility_type
    );

    if (axeResultsAfterModification.violations.length > 0) {
      for (const result of axeResultsAfterModification.violations) {
        for (const _ of result.nodes) {
          // update violations
          analysisResult[0].accessbilityTestResult.violationAfterModification += 1;
        }
      }
    }

    // const violationsAfterModification =
    //   axeResultsAfterModification.violations.length;

    // Save the entire Axe Core report after modifications to a JSON file
    await saveAsJSON(
      JSON.stringify(axeResultsAfterModification, null, 2),
      `${extractDomainFromURL(
        url
      )}_${accessibility_type}_axe_report_after_repair`,
      `${extractDomainFromURL(
        url
      )}_${accessibility_type}_${prompt_technique}_${model}_${temperature}`
    );

    await browser.close(); // Close the browser instance

    // Save the analysis results as JSON, naming the file based on the domain and accessibility type
    const jsonData = JSON.stringify(analysisResult, null, 2);
    saveAsJSON(
      jsonData,
      `${extractDomainFromURL(url)}_${accessibility_type}_result`,
      `${extractDomainFromURL(
        url
      )}_${accessibility_type}_${prompt_technique}_${model}_${temperature}`
    );
    console.log(`Finished experiment for: ${url}`);
    return analysisResult; // Return the analysis result array
  } else {
    // If no accessibility issues are found, store an error message in the results
    analysisResult.push({
      error: `No accessibility issues regarding "${accessibility_type}" found in provided URL.`,
    });

    // Save the results as JSON, indicating no issues were found
    const jsonData = JSON.stringify(analysisResult, null, 2);
    saveAsJSON(
      jsonData,
      `${extractDomainFromURL(url)}_${accessibility_type}_result`,
      `${extractDomainFromURL(
        url
      )}_${accessibility_type}_${prompt_technique}_${model}_${temperature}`
    );

    await browser.close(); // Close the browser instance
    console.log(`Finished experiment for: ${url}`);
    return -1; // Indicate that no issues were found
  }
}

// Export Function
module.exports.runAnalysis = runAnalysis;
