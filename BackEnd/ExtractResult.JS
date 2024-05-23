const fs = require("fs");
const path = require("path");
const { createObjectCsvWriter } = require("csv-writer");

// Setup CSV writer
const csvWriter = createObjectCsvWriter({
  path: "./output.csv",
  header: [
    { id: "URL", title: "URL" },
    { id: "model", title: "Model" },
    { id: "accessibilityType", title: "Accessibility Type" },
    { id: "promptTechnique", title: "Prompt Technique" },
    { id: "temperature", title: "Temperature" },
    {
      id: "violationBeforeModification",
      title: "Violation Before Modification",
    },
    { id: "violationAfterModification", title: "Violation After Modification" },
  ],
  append: true,
});

// Function to process each directory
async function processDirectory(parentDir) {
  const subDirs = ["COT", "FewShot", "ReAct"];
  const records = [];

  for (const modelName of ["Claude", "GPT"]) {
    for (const subDir of subDirs) {
      const fullPath = path.join(parentDir, modelName, subDir);
      try {
        const taskFolders = fs
          .readdirSync(fullPath, { withFileTypes: true })
          .filter((dirent) => dirent.isDirectory())
          .map((dirent) => dirent.name);

        for (const folder of taskFolders) {
          const folderPath = path.join(fullPath, folder);
          const files = fs.readdirSync(folderPath);

          let url = "";
          let resultData = {};

          for (const file of files) {
            if (file.includes("axe_report_before_repair")) {
              const data = JSON.parse(
                fs.readFileSync(path.join(folderPath, file), "utf8")
              );
              url = data.url;
            }

            if (file.includes("result")) {
              const result = JSON.parse(
                fs.readFileSync(path.join(folderPath, file), "utf8")
              );
              if (result.length > 0) {
                resultData = result[0];
                const details = resultData.analysisDetails;
                let model = "";
                let accessibilityType = "";
                let promptTechnique = "";
                let temperature = "";

                details.forEach((detail) => {
                  if (detail.model) {
                    model = detail.model;
                  } else if (detail.accessibility_type) {
                    accessibilityType = detail.accessibility_type;
                  } else if (detail.prompt_technique) {
                    promptTechnique = detail.prompt_technique;
                  } else if (detail.temperature !== undefined) {
                    temperature = detail.temperature;
                  }
                });

                const testResults = resultData.accessbilityTestResult;
                const violationBeforeModification = testResults
                  ? testResults.violationBeforeModification
                  : "";
                const violationAfterModification = testResults
                  ? testResults.violationAfterModification
                  : "";

                records.push({
                  URL: url,
                  model: model,
                  accessibilityType: accessibilityType,
                  promptTechnique: promptTechnique,
                  temperature: temperature,
                  violationBeforeModification: violationBeforeModification,
                  violationAfterModification: violationAfterModification,
                });
              }
            }
          }
        }
      } catch (error) {
        console.error(`Failed to process directory ${fullPath}: ${error}`);
      }
    }
  }

  if (records.length > 0) {
    await csvWriter
      .writeRecords(records)
      .then(() => console.log("CSV file has been updated successfully."))
      .catch((error) => console.error("Failed to write to CSV:", error));
  } else {
    console.log("No records to write to CSV.");
  }
}

// Start processing from the given directory path
processDirectory("./Files/Analysis/MetaViewport");
