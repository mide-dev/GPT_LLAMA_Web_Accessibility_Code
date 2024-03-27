// Import file system module
const fs = require("fs");
const cheerio = require("cheerio");

/**
 * This function saves data as a JSON file.
 *
 * @param {string} data The stringified JSON data to save.
 * @param {string} filename The name of the file (without extension) where the data will be saved.
 * @returns {Promise<boolean>} A promise that resolves to true if the file was saved successfully, and false otherwise.
 */
async function saveAsJSON(data, filename) {
  // save data to file
  fs.writeFile(`Files/${filename}.json`, data, "utf8", (err) => {
    if (err) {
      // If error, log the error and return false.
      console.error("Error saving the file:", err);
      return false;
    }
    // Return true if the file was saved successfully.
    return true;
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
 * This function extracts HTML elements from the given text input based on the specified selector.
 *
 * @param {string} inputText The text input containing HTML.
 * @param {string} elementSelector The selector for the HTML element(s) to extract.
 * @return {string[]} An array of strings, each being the outer HTML of a matched element.
 */
function extractHtmlElement(inputText, elementSelector) {
  const $ = cheerio.load(inputText);
  const extractedElements = [];

  $(elementSelector).each(function () {
    // If selector is parsing image HTML, Check if the img has a 'src' attribute before including it
    if (elementSelector === "img" && $(this).attr("src")) {
      extractedElements.push($.html(this));
    }
  });

  return extractedElements;
}


// Export functions.
module.exports.extractDomainFromURL = extractDomainFromURL;
module.exports.saveAsJSON = saveAsJSON;
module.exports.extractHtmlElement = extractHtmlElement;
