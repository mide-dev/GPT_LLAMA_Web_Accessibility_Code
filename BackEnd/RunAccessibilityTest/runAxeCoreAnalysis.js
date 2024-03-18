// Import axe-core library
const axeCore = require("axe-core");

/**
 * Runs Axe-core accessibility analysis on a web page for a specific type of accessibility rule.
 * This function injects the Axe-core library into the page, configures the types of accessibility issues to test,
 * and then runs the test, returning the results.
 * 
 * @param {Object} page The Puppeteer page object representing the web page to test.
 * @param {string} accessibility_type The specific type of accessibility rule to test (e.g., 'image-alt').
 * @returns {Promise<Object>} A promise that resolves to the results of the Axe-core accessibility analysis.
 */
async function runAxeCoreAnalysis(page, accessibility_type) {
  // Inject Axe-core script into Puppeteer page.
  await page.evaluate(axeCore.source);

  // Define the options for the Axe-core analysis. 
  // Here, I've specified that the analysis should only run tests for the provided accessibility_type.
  const axeOptions = {
    runOnly: {
      type: "rule",
      values: [accessibility_type],
    },
  };

  // Run the Axe-core accessibility tests within the page's context, using the specified options.
  return await page.evaluate(
    (options) => axe.run(document, options),
    axeOptions
  );
}

// Export function.
module.exports.runAxeCoreAnalysis = runAxeCoreAnalysis;
