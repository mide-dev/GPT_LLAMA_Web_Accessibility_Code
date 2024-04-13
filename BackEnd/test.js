// Import required modules and functions
const puppeteer = require("puppeteer");
const {
  runAxeCoreAnalysis,
} = require("./RunAccessibilityTest/runAxeCoreAnalysis");
const { saveAsJSON, extractDomainFromURL } = require("./Operations/operations");
const { promptGPT } = require("./LLM/GPT");
const { promptLlama } = require("./LLM/Llama");

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
// async function runAnalysis(url, accessibility_type) {
//   const analysisResult = []; // Initialize array to store the analysis results

//   // Launch a new browser instance using Puppeteer
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage(); // Open a new page in the browser
//   await page.goto(url); // Navigate to the specified URL

//   // Run Axe-core analysis to check for accessibility violations before making any modifications
//   const axeResultsBeforeModification = await runAxeCoreAnalysis(
//     page,
//     accessibility_type
//   );

//   if (axeResultsBeforeModification.violations.length > 0) {
//     // Save the entire Axe Core report before any modifications to a JSON file
//     await saveAsJSON(
//       JSON.stringify(axeResultsBeforeModification, null, 2),
//       `${extractDomainFromURL(
//         url
//       )}_${accessibility_type}_axe_report_before_repair`,
//       extractDomainFromURL(url)
//     );

//     console.log("yes");
//     await browser.close();
//     return true;
//   }

//   console.log("No");
//   await browser.close();
//   return false;
// }

// // // Execute the analysis with predefined arguments
// const urls = [
//   "https://www.wiley.com/en-us/education/alta",
//   "https://www.trendmicro.com/en_sg/business.html",
//   "https://buy.seahawks.com/",
//   "https://www.superiorglove.com/",
//   "https://www.franklincovey.com/",
//   "https://www.westgatechryslerjeepdodge.com/",
//   "https://shop.spectator.org/",
//   "https://swappa.com/",
// ];

// runAnalysis("https://www.franklincovey.com/", "meta-viewport");
// runAnalysis(site, "meta-viewport");
// runAnalysis(site, "html-has-lang");

const prompt = `

Correct the HTML for accessibility based on the WCAG 2.1 violation description below. Use the example below as a guide.

Example:
      *WCAG 2.1 violation description* : Fix any of the following:\n  Element has insufficient color contrast of 4.41 (foreground color: #1e73be, background color: #f2f2f2, font size: 16.8pt (22.4px), font weight: normal). Expected contrast ratio of 4.5:1.
      - Incorrect HTML: <div class="row-bg viewport-desktop using-bg-color" style="background-color: #f2f2f2;"></div>
      - Corrected HTML: <div class="row-bg viewport-desktop using-bg-color" style="color: #1c71bc; background-color: #f2f2f2;"></div>'
  
Your Task:
*WCAG 2.1 violation description* : *WCAG 2.1 violation description* : Fix any of the following:\n  Element has insufficient color contrast of 4.41 (foreground color: #1e73be, background color: #f2f2f2, font size: 16.8pt (22.4px), font weight: normal). Expected contrast ratio of 4.5:1.
Incorrect HTML: <h4 class="pg-21">welcome to aldi</h4>
`;
(async () => {
  const solution = await promptLlama(prompt, 0.5);

  console.log(solution);
  return solution;
})();
