// Import file system module
const fs = require("fs");
const cheerio = require("cheerio");
const path = require("path");

/**
 * This function saves data as a JSON file.
 *
 * @param {string} data The stringified JSON data to save.
 * @param {string} filename The name of the file (without extension) where the data will be saved.
 * @returns {Promise<boolean>} A promise that resolves to true if the file was saved successfully, and false otherwise.
 */

// Async function to save data as JSON into a folder named after the domain.
async function saveAsJSON(data, filename, domain) {
  // Define the directory path using the domain name.
  const dirPath = path.join("Files", domain);

  // Check if the directory exists, if not create it.
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Define the full file path.
  const filePath = path.join(dirPath, `${filename}.json`);

  // Return a new Promise to handle the asynchronous writeFile operation.
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, "utf8", (err) => {
      if (err) {
        console.error("Error saving the file:", err);
        reject(false); // Reject the Promise if an error occurs.
      } else {
        resolve(true); // Resolve the Promise successfully.
      }
    });
  });
}

/**
 * This function extracts domain name from a given URL.
 *
 * @param {string} siteurl The full URL from which to extract the domain name.
 * @returns {string} The extracted domain name.
 */
function extractDomainFromURL(siteurl) {
  // Create a new URL object to parse the given site URL.
  const url = new URL(siteurl);

  // second-level domain suffixes.
  const secondLevelDomainSuffixes = [
    "co.uk",
    "gov.uk",
    "org.uk",
    "ac.uk",
    "me.uk",
    "ltd.uk",
    "plc.uk",
    "net.uk",
    "sch.uk",
  ];

  // Split the hostname of the URL into parts.
  const domainParts = url.hostname.split(".");

  // Check if the domain ends with a second-level domain suffix.
  const domainEndsWithSLDSuffix = secondLevelDomainSuffixes.some((suffix) => {
    const suffixParts = suffix.split(".");
    const lengthDifference = domainParts.length - suffixParts.length;

    // Compare each part of the suffix with the corresponding part of the domain.
    return suffixParts.every(
      (part, index) => domainParts[lengthDifference + index] === part
    );
  });

  let mainPart;
  if (domainEndsWithSLDSuffix) {
    // For domains ending with a SLD suffix, extract the part just before the suffix.
    mainPart = domainParts[domainParts.length - 3];
  } else {
    // For other domains, extract the second-last part or the first part if the domain is short.
    mainPart =
      domainParts.length > 2
        ? domainParts[domainParts.length - 2]
        : domainParts[0];
  }

  // Return the extracted domain.
  return mainPart;
}

/**
 * Extracts the HTML of the first element found in a text.
 * @param {string} text The text containing the HTML to extract.
 * @return {string} The HTML of the first element found, or an empty string if no elements are found.
 */
function extractHtmlElement(text) {
  // Find the last occurrence of "```html"
  const lastHtmlTagIndex = text.lastIndexOf("```html");

  let startIndex, endIndex;

  if (lastHtmlTagIndex !== -1) {
    // Find the end marker "```" after the last occurrence of "```html"
    const endMarkerIndex = text.indexOf("```", lastHtmlTagIndex + 6); // +6 to move past "```html"

    if (endMarkerIndex !== -1) {
      // If the end marker is found, adjust the search for "<" after "```html" and ">" before the end marker
      startIndex = text.indexOf("<", lastHtmlTagIndex);
      endIndex = text.lastIndexOf(">", endMarkerIndex);
    } else {
      // If no closing "```" is found, revert to searching the whole text after "```html"
      startIndex = text.indexOf("<", lastHtmlTagIndex);
      endIndex = text.lastIndexOf(">");
    }
  } else {
    // If no "```html" is found, search the whole text
    startIndex = text.indexOf("<");
    endIndex = text.lastIndexOf(">");
  }

  // Check if both the start and end of an HTML element were found and in correct order
  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    return text.substring(startIndex, endIndex + 1);
  } else {
    // Return an empty string if no valid HTML element is found
    return "";
  }
}

// Export functions.
module.exports.extractDomainFromURL = extractDomainFromURL;
module.exports.saveAsJSON = saveAsJSON;
module.exports.extractHtmlElement = extractHtmlElement;
