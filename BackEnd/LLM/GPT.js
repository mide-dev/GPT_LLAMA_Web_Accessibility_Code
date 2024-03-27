// Import OpenAI SDK
const OpenAI = require("openai");

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: "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", // Note: Intentionally left the API key public.
});

/**
 * Function to send a prompt to GPT-3.5 and get a response.
 * @param {string} prompt The text prompt to send to GPT-3.5.
 * @param {number} temperature Controls the randomness of the output.
 * @returns {Promise<string>} The GPT-generated response text or an error message.
 */
async function promptGPT(prompt, temperature, url1) {
  try {
    // create a chat completion request
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: url1,
              },
            },
          ],
        },
      ], // Define user's message
      model: "gpt-4-vision-preview", // Specify the model to use
      max_tokens: 600, // Set maximum length of generated response
      temperature: temperature, // set temperature
    });

    // Return response
    return chatCompletion.choices[0].message.content;
  } catch (err) {
    // If an error occurs, return the error
    console.log(err.message);
    return err;
  }
}

const prompt1 = `
Correct the HTML for accessibility based on the WCAG 2.1 violation description below. Use the example below as a guide.

Example:
*WCAG 2.1 violation description* : Fix any of the following:\n  Element has insufficient color contrast of 4.41 (foreground color: #1e73be, background color: #f2f2f2, font size: 16.8pt (22.4px), font weight: normal). Expected contrast ratio of 4.5:1.
Incorrect HTML: '<div class="row-bg viewport-desktop using-bg-color" style="background-color: #f2f2f2;"></div>'
- Thought: I need to make sure the color contrast in the provided HTML matches complies with the required contrast of 4.5:1 as per WCAG 2.1 guidelines.
- Observation: Since the contrast ratio is already at 4.41 with a foreground color of #1e73be (a medium blue) and a background color of #f2f2f2 (a very light grey), making a slight adjustment to the background color should achieve compliance without significantly altering the visual aesthetics of the website.
- Thought: I should use this new insight to calculate a slightly darker shade of the current background color that would meet the required contrast ratio of 4.5:1.
- Action: calculate a slightly darker shade of [#f2f2f2].
- Thought: I got "#ededed" from the above calculation. I need to verify that the new background color combined with the foreground color meets the constrast ratio of 4.5:1.
- Action: Calculate contrast between new background color ("#ededed") and foreground color (#1e73be) using WCAG contrast formula - contrast ratio = (L1 +0.05)/(L2 + 0.05).
- Observation: From the calculation, I see that the new contrast ratio is 4.22:1 which does not comply with the required 4.5:1.
- Thought: I need to choose a new color. I'll alter the foreground color (#1e73be) this time while keeping the old background color (#f2f2f2).
- Action: Choose new foreground color that significantly enhances constrast.
- Thought: The new foreground color is "#1c71bc". I need to verify that this new foreground color combined with initial background color (#f2f2f2) meets up to a contrast of 4.5:1.
- Action: Calculate contrast between new foreground color ("#1c71bc") and background color (#f2f2f2) using WCAG contrast formula - contrast ratio = (L1 +0.05)/(L2 + 0.05).
- Observation: This new combination meets the required contrast of 4.5:1.
- Thought: I need to overrite the previous color using the style tag in the above HTML.
Corrected HTML: '<div class="row-bg viewport-desktop using-bg-color" style="color: #1c71bc; background-color: #f2f2f2;"></div>
'

*WCAG 2.1 violation description* : Fix any of the following:\n  Element has insufficient color contrast of 3.35 (foreground color: #ffffff, background color: #898d8d, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1.
Incorrect HTML: <div class="footer-copyright"><b>5 Mill &amp; Main Place, Suite 500. Maynard, MA 01754, USA<span class="footer-phone">Tel#: +1 978-461-7000</span></b><br>© 2024 Stratus Technologies. All Rights Reserved.</div>
`;

const url = `https://fjord.dropboxstatic.com/warp/conversion/dropbox/dmep/en-us/assets/customer-stories/topline/DG_London_office_1440px.jpg?id=1414e990-b43b-4be7-a65c-19eb101fd424&amp;output_type=jpg`;

(async () => {
  const res = await promptGPT(prompt1, 0.5, url);
  console.log(res);
})();

// Export function
module.exports.promptGPT = promptGPT;
