const Anthropic = require("@anthropic-ai/sdk");

const anthropic = new Anthropic({
  apiKey:
    "", // defaults to process.env["ANTHROPIC_API_KEY"]
});

async function promptClaude(prompt, temperature) {
  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 500,
      temperature: temperature,
      messages: [{ role: "user", content: prompt }],
    });
    return msg.content[0].text;
  } catch (err) {
    // If an error occurs, return the error
    return err;
  }
}

// Export function
module.exports.promptClaude = promptClaude;
