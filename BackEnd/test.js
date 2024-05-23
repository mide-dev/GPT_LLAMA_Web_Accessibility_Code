// Import required modules and functions
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const axeCore = require("axe-core");
const {
  runAxeCoreAnalysis,
} = require("./RunAccessibilityTest/runAxeCoreAnalysis");
const { saveAsJSON, extractDomainFromURL } = require("./Operations/operations");
const { promptGPT } = require("./LLM/GPT");
const { promptLlama } = require("./LLM/Llama");
// const verify = {};

// function delayfs(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// async function saveAsJSON(data, filename) {
//   // Define the directory path using the domain name.
//   const dirPath = "./verified";

//   // Check if the directory exists, if not create it.
//   if (!fs.existsSync(dirPath)) {
//     fs.mkdirSync(dirPath, { recursive: true });
//   }

//   // Define the full file path.
//   const filePath = path.join(dirPath, `${filename}.json`);

//   // Return a new Promise to handle the asynchronous writeFile operation.
//   return new Promise((resolve, reject) => {
//     fs.writeFile(filePath, data, "utf8", (err) => {
//       if (err) {
//         console.error("Error saving the file:", err);
//         reject(false); // Reject the Promise if an error occurs.
//       } else {
//         resolve(true); // Resolve the Promise successfully.
//       }
//     });
//   });
// }

// async function runAxeCoreAnalysis(page) {
//   // Inject Axe-core script into Puppeteer page.
//   await page.evaluate(axeCore.source);

//   // Define the options for the Axe-core analysis.
//   // Here, I've specified that the analysis should only run tests for the provided accessibility_type.
//   const axeOptions = {
//     runOnly: {
//       type: "rule",
//       values: ["aria-required-attr", "aria-allowed-attr"],
//     },
//   };

//   // Run the Axe-core accessibility tests within the page's context, using the specified options.
//   return await page.evaluate(
//     (options) => axe.run(document, options),
//     axeOptions
//   );
// }

// async function runAnalysis(url) {
//   // const analysisResult = []; // Initialize array to store the analysis results

//   // Launch a new browser instance using Puppeteer
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage(); // Open a new page in the browser
//   await page.goto(url); // Navigate to the specified URL

//   // Run Axe-core analysis to check for accessibility violations before making any modifications
//   const axeResultsBeforeModification = await runAxeCoreAnalysis(
//     page
//   );

//   if (axeResultsBeforeModification.violations.length > 0) {
//     // Save the entire Axe Core report before any modifications to a JSON file
//     axeResultsBeforeModification.violations.forEach((violation) => {
//       if (!verify[violation.id]) {
//         verify[violation.id] = {
//           total: 0,
//           urls: [],
//         };
//       }

//       verify[violation.id].total = (verify[violation.id].total || 0) + 1;
//       verify[violation.id].urls.push(axeResultsBeforeModification.url); // Use push instead of append
//     });
//   }

//   await browser.close(); // Close the browser instance
//   return -1; // Indicate that no issues were found
// }

const prompt = `
Correct the HTML for accessibility based on the WCAG 2.1 violation description below. Use the example below as a guide.

Example:
      *WCAG 2.1 violation description* : Fix any of the following:\n  Element has insufficient color contrast of 4.41 (foreground color: #1e73be, background color: #f2f2f2, font size: 16.8pt (22.4px), font weight: normal). Expected contrast ratio of 4.5:1.
      - Incorrect HTML: '<img class="icon" src="https://fjord.dropboxstatic.com/SharedContentLight.svg">'
      - Thought: I need to strike a balance by altering either the foreground or background color in a way that will match the required contrast ratio of 4.5:1 while maintaing the visual aesthetics of the website. 
      - Corrected HTML: '<div class="row-bg viewport-desktop using-bg-color" style="color: #1c71bc; background-color: #f2f2f2;"></div>'
  
      Your Task:
      *WCAG 2.1 violation description* : Fix any of the following:\n  Element has insufficient color contrast of 3.7 (foreground color: #0091ae, background color: #ffffff, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1.
      - Incorrect HTML: <a href=\"https://www.nuorder.com/privacy-policy-2/\" target=\"_blank\">Privacy Policy</a>
      - Thought:
      - Corrected HTML:
`;
(async () => {
  const solution = await promptLlama(prompt, 0.5);

  console.log(solution);
  return solution;
})();
