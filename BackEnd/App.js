const { runAnalysis } = require("./main");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function automateExperiment() {
  const urls = ["https://www.nuorder.com/", "https://www.stratus.com/"];

  for (const url of urls) {
    try {
      await runAnalysis(url, "color-contrast", "ReAct", 1, "Claude"); // Run analysis
      await delay(30000); // Wait for 30 sec (30000 milliseconds)
    } catch (err) {
      console.log(`ERROR: ${url}: ${err}`);
      continue;
    }
  }

  console.log("********************");
  console.log("DONE!!!");
}

automateExperiment();
