// Import required modules and functions
const puppeteer = require("puppeteer");
const {
  runAxeCoreAnalysis,
} = require("./RunAccessibilityTest/runAxeCoreAnalysis");
const { saveAsJSON, extractDomainFromURL } = require("./Operations/operations");
const { imageAltPrompt } = require("./LLM/prompt");
const { promptGPT } = require("./LLM/GPT");

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
async function runAnalysis(url, accessibility_type) {
  const analysisResult = []; // Initialize array to store the analysis results

  // Launch a new browser instance using Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage(); // Open a new page in the browser
  await page.goto(url); // Navigate to the specified URL

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
    )}_${accessibility_type}_axe_report_before_repair`
  );

  await browser.close();
  return true;
}

// // Execute the analysis with predefined arguments
runAnalysis("https://www.stratus.com/", "color-contrast");


// Export Function
module.exports.runAnalysis = runAnalysis;
