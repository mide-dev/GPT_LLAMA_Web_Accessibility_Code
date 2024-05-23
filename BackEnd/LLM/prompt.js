const getAccesibilityPrompt = (
  accessibility_type,
  violationHtml,
  description,
  extractedText
) => {
  const accessibilityTypes = {
    "color-contrast": {
      fewShot: `
      Example:
      *WCAG 2.1 violation description* : Fix any of the following:\n  Element has insufficient color contrast of 4.41 (foreground color: #1e73be, background color: #f2f2f2, font size: 16.8pt (22.4px), font weight: normal). Expected contrast ratio of 4.5:1.
      - Incorrect HTML: <div class="row-bg viewport-desktop using-bg-color" style="background-color: #f2f2f2;"></div>
      - Corrected HTML: <div class="row-bg viewport-desktop using-bg-color" style="color: #1c71bc; background-color: #f2f2f2;"></div>
      
      Your Task:
      *WCAG 2.1 violation description* : ${description}
      - Incorrect HTML: ${violationHtml}
      - Corrected HTML: `,
      cot: `
      Example:
      *WCAG 2.1 violation description* : Fix any of the following:\n  Element has insufficient color contrast of 4.41 (foreground color: #1e73be, background color: #f2f2f2, font size: 16.8pt (22.4px), font weight: normal). Expected contrast ratio of 4.5:1.
      - Incorrect HTML: '<img class="icon" src="https://fjord.dropboxstatic.com/SharedContentLight.svg">'
      - Thought: I need to strike a balance by altering either the foreground or background color in a way that will match the required contrast ratio of 4.5:1 while maintaing the visual aesthetics of the website. 
      - Corrected HTML: '<div class="row-bg viewport-desktop using-bg-color" style="color: #1c71bc; background-color: #f2f2f2;"></div>'
  
      Your Task:
      *WCAG 2.1 violation description* : ${description}
      - Incorrect HTML: ${violationHtml}
      - Thought:
      - Corrected HTML:`,
      ReAct: `
      Example:
        *WCAG 2.1 violation description* : Fix any of the following:\n  Element has insufficient color contrast of 4.41 (foreground color: #1e73be, background color: #f2f2f2, font size: 16.8pt (22.4px), font weight: normal). Expected contrast ratio of 4.5:1.
        Incorrect HTML: '<div class="row-bg viewport-desktop using-bg-color" style="background-color: #f2f2f2;"></div>'
        - Thought: I need to make sure the color contrast in the provided HTML matches complies with the required contrast of 4.5:1 as per WCAG 2.1 guidelines.
        - Observation: Since the contrast ratio is already at 4.41 with a foreground color of #1e73be (a medium blue) and a background color of #f2f2f2 (a very light grey), I should alter the foreground color while maintaining visual aesthetics of the website.
        - Action: Choose new foreground color that significantly enhances constrast.
        - Thought: The new foreground color is "#1c71bc". I need to verify that this new foreground color combined with background color (#f2f2f2) meets up to a contrast of 4.5:1.
        - Action: Calculate contrast between new foreground color ("#1c71bc") and background color (#f2f2f2) using WCAG contrast formula - contrast ratio = (L1 +0.05)/(L2 + 0.05).
        - Observation: This new combination meets the required contrast of 4.5:1.
        - Thought: I need to overrite the previous color using the style tag in the above HTML.
        Corrected HTML: '<div class="row-bg viewport-desktop using-bg-color" style="color: #1c71bc; background-color: #f2f2f2;"></div>'
  
        Your Task:
        *WCAG 2.1 violation description* : ${description}
        Incorrect HTML: ${violationHtml}`,
    },
    // we'll use pupeteer to extract title and use it
    "link-name": {
      fewShot: `
      *WCAG 2.1 violation description* : ${description}
  
      Example 1:
      - Incorrect HTML: <a href="https://www.w3.org/WAI"><img src="/test-assets/shared/w3c-logo.png" alt=""/></a>
      - Corrected HTML: <a href="https://www.w3.org/WAI" title="Web Accessibility Initiative"><img src="/test-assets/shared/w3c-logo.png" alt=""/></a>
  
      Example 2:
      - Incorrect HTML: <a id="slider-51-slide-46-layer-83" class="rs-layer rs-layer-static" href="#book-a-demo" target="_self" data-type="image">
      - Corrected HTML: <a id="slider-51-slide-46-layer-83" class="rs-layer rs-layer-static" href="#book-a-demo" title="Book A Demo" target="_self" data-type="image">
      
      Your Task:
      - Incorrect HTML: ${violationHtml}
      - Corrected HTML: `,
      cot: `
      *WCAG 2.1 violation description* : ${description}
  
      Example 1:
      - Incorrect HTML: <a href="https://www.w3.org/WAI"><img src="/test-assets/shared/w3c-logo.png" alt=""/></a>
      - Thought: I need to correct the above HTML by adding a title attribute to the link. Since it's "href" is a url, I can search the url to get context on what the title content should be.
      - Corrected HTML: <a href="https://www.w3.org/WAI" title="Web Accessibility Initiative"><img src="/test-assets/shared/w3c-logo.png" alt=""/></a>
  
      Example 2:
      - Incorrect HTML: <a id="slider-51-slide-46-layer-83" class="rs-layer rs-layer-static" href="#book-a-demo" target="_self" data-type="image">
      - Thought: I need to correct the above HTML by adding a title attribute to the link. Since it's "href" is using an anchor tag, I can use its name to set the title content.
      - Corrected HTML: <a id="slider-51-slide-46-layer-83" class="rs-layer rs-layer-static" href="#book-a-demo" title="Book A Demo" target="_self" data-type="image">
  
      Your Task:
      - Incorrect HTML: ${violationHtml}
      - Thought:
      - Corrected HTML:`,
      ReAct: `
      *WCAG 2.1 violation description* : ${description}
  
      Example 1:
      - Incorrect HTML: <a href="https://www.w3.org/WAI"><img src="/test-assets/shared/w3c-logo.png" alt=""/></a>
      - Thought: I need to correct the above HTML by adding a title attribute to the link. Since it's "href" is a url, I can search the url to get context on what the title content should be.
      - Action: Search[https://www.w3.org/WAI]
      - Observation: The search result shows that the URL is about Web Accessibility Initiative.
      - Thought: I'll use this new observation to provide content to the title attribute.
      - Corrected HTML: <a href="https://www.w3.org/WAI" title="Web Accessibility Initiative"><img src="/test-assets/shared/w3c-logo.png" alt=""/></a>
  
      Example 2:
      - Incorrect HTML: <a id="slider-51-slide-46-layer-83" class="rs-layer rs-layer-static" href="#book-a-demo" target="_self" data-type="image">
      - Thought: I need to correct the above HTML by adding a title attribute to the link. Since it's "href" is using an anchor tag, I can use its name to set the title content.
      - Observation: The "href" points to an id that says - #book-a-demo.
      - Thought: I'll use this new observation to provide content to the title attribute.
      - Corrected HTML: <a id="slider-51-slide-46-layer-83" class="rs-layer rs-layer-static" href="#book-a-demo" title="Book A Demo" target="_self" data-type="image">
  
      Your Task:
      - Incorrect HTML: ${violationHtml}`,
    },
    // we'll use npm franc to pass context
    "html-has-lang": {
      fewShot: `
      *WCAG 2.1 violation description* : ${description}
      
      Example:
      *Extracted text from website*: "Africa's leading Automobile"
      - Incorrect HTML: <html prefix=\"og: http://ogp.me/ns#\">
      - Corrected HTML: <html lang="en" prefix=\"og: http://ogp.me/ns#\">
      
      Your Task:
      *Extracted text from website*: "${extractedText}"
      - Incorrect HTML: ${violationHtml}
      - Corrected HTML: `,
      cot: `
      *WCAG 2.1 violation description* : ${description}
  
      Example:
      *Extracted text from website*: "Africa's leading Automobile"
      - Incorrect HTML: <html prefix=\"og: http://ogp.me/ns#\">
      - Thought: I need to correct the above HTML by adding a adding the "lang" attribute and assigning the right language using the "Extracted text from website" for language context. 
      - Corrected HTML: <html lang="en" prefix=\"og: http://ogp.me/ns#\">
  
      Your Task:
      *Extracted text from website*: "${extractedText}"
      - Incorrect HTML: ${violationHtml}
      - Thought:
      - Corrected HTML:`,
      ReAct: `
      *WCAG 2.1 violation description* : ${description}
  
      Example:
      *Extracted text from website*: "Africa's leading Automobile"
      - Incorrect HTML: <html prefix=\"og: http://ogp.me/ns#\">
      - Thought: I need to correct the above HTML by adding a adding the "lang" attribute and assigning the right language to it.
      - Observation: Since the Extracted text from the website is in english, then the site must be in english. 
      - Action: Add[lang="en"] to the HTML
      - Corrected HTML: <html lang="en" prefix=\"og: http://ogp.me/ns#\">

      Your Task:
      *Extracted text from website*: "${extractedText}"
      - Incorrect HTML: ${violationHtml}`,
    },
    "aria-required-attr": {
      fewShot: `
      *WCAG 2.1 violation description* : ${description}
  
      Example 1:
      - Incorrect HTML: <div role="textbox" contenteditable="true"></div>
      - Corrected HTML: <div role="textbox" contenteditable="true" aria-multiline="true aria-label="Enter your hobbies" aria-required="true"></div>

      Your Task:
      - Incorrect HTML: ${violationHtml}
      - Corrected HTML:`,
      cot: `
      *WCAG 2.1 violation description* : ${description}
  
      Example 1:
      - Incorrect HTML: <div role="textbox" contenteditable="true"></div>
      - Thought: Because the above div element have a role of textbox, I need to add all WCAG required aria attributes (aria-multiline, aria-label, and aria-required) that is needed for a textbox according to WCAG 2.1.
      - Corrected HTML: <div role="textbox" contenteditable="true" aria-multiline="true aria-label="Enter your hobbies" aria-required="true"></div>
  
      Your Task:
      - Incorrect HTML: ${violationHtml}
      - Thought:
      - Corrected HTML:`,
      ReAct: `
      *WCAG 2.1 violation description* : ${description}
  
      Example 1:
      - Incorrect HTML: <div role="textbox" contenteditable="true"></div>
      - Thought: Because the above div element have a role of textbox, I need to add all WCAG 2.1 required aria attributes that is needed for a textbox to fix the issue.
      - Observation: an element with a role="textbox" needs multiple attributes (aria-multiline, aria-label, and aria-required) according to WCAG.
      - Action: add[ria-multiline="true aria-label="Enter your hobbies" aria-required="true"] to the HTML.
      - Corrected HTML: <div role="textbox" contenteditable="true" aria-multiline="true aria-label="Enter your hobbies" aria-required="true"></div>
      
      Your Task:
      - Incorrect HTML: ${violationHtml}`,
    },
    "meta-viewport": {
      fewShot: `
      *WCAG 2.1 violation description* : ${description}
  
      Example 1:
      - Incorrect HTML: <meta name="viewport" />
      - Corrected HTML: <meta name="viewport" content="user-scalable=yes" />
  
      Example 2:
      - Incorrect HTML: <meta name="viewport" content="maximum-scale=1.0" />
      - Corrected HTML: <meta name="viewport" content="maximum-scale=2.0" />
  
      Your Task:
      - Incorrect HTML: ${violationHtml}
      - Corrected HTML:`,
      cot: `
      *WCAG 2.1 violation description* : ${description}
  
      Example 1:
      - Incorrect HTML: <meta name="viewport" />
      - Thought: I need to add user scaling to the meta element above and set it to yes according to WCAG 2.1.
      - Corrected HTML: <meta name="viewport" content="user-scalable=yes" />
  
      Example 2:
      - Incorrect HTML: <meta name="viewport" content="maximum-scale=1.0" />
      - Thought: I need to set the maximum scale to 2.0 which is the minimum value required for meta elements according to WCAG 2.1.
      - Corrected HTML: <meta name="viewport" content="maximum-scale=2.0" />
  
      Your Task:
      - Incorrect HTML: ${violationHtml}
      - Thought:
      - Corrected HTML:`,
      ReAct: `
      *WCAG 2.1 violation description* : ${description}
  
      Example 1:
      - Incorrect HTML: <meta name="viewport" />
      - Observation: The meta element above does not have a user-scalable property.
      - Thought: I need to add user scaling to the element and set its value to yes according to WCAG 2.1.
      - Action: add[content="user-scalable=yes"]
      - Corrected HTML: <meta name="viewport" content="user-scalable=yes" />
  
      Example 2:
      - Incorrect HTML: <meta name="viewport" content="maximum-scale=1.0" />
      - Observation: The meta element above allows user scaling but its maximum scale is set to 1.0.
      - Thought: I need to overrite the maximum scale to 2.0 which is the minimum value required for meta elements according to WCAG 2.1.
      - Action: add[content="maximum-scale=2.0"]
      - Corrected HTML: <meta name="viewport" content="maximum-scale=2.0" />
  
      Your Task:
      - Incorrect HTML: ${violationHtml}`,
    },
  };
  return accessibilityTypes[accessibility_type];
};

function generateAccessibilityPrompt(
  accessibility_type,
  violationHtml,
  description,
  promptTechnique,
  extractedText
) {
  const strategy = getAccesibilityPrompt(
    accessibility_type,
    violationHtml,
    description,
    extractedText
  );
  if (!strategy) {
    console.error("Unsupported issue type:", accessibility_type);
    return;
  }

  let body;
  switch (promptTechnique) {
    case "fewShot":
      body = strategy.fewShot;
      break;
    case "cot":
      body = strategy.cot;
      break;
    case "ReAct":
      body = strategy.ReAct;
      break;
    default:
      console.error("Unsupported prompt technique:", promptTechnique);
      return;
  }

  return `
Correct the HTML for accessibility based on the WCAG 2.1 violation description below. Use the example below as a guide.

${body}
`;
}

// export function
module.exports.generateAccessibilityPrompt = generateAccessibilityPrompt;
