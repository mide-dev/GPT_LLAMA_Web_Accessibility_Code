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
async function promptGPT(prompt, temperature) {
  try {
    // create a chat completion request
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }], // Define user's message
      model: "gpt-3.5-turbo", // Specify the model to use
      max_tokens: 600, // Set maximum length of generated response
      temperature: temperature, // set temperature 
    });

    // Return response
    return chatCompletion.choices[0].message.content;
  } catch (err) {
    // If an error occurs, return the error
    return err;
  }
}

// Export function
module.exports.promptGPT = promptGPT;
