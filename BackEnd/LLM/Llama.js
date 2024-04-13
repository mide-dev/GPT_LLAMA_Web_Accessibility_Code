async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/meta-llama/Llama-2-13b-chat-hf",
    {
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json", // Add this line
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  // Handle HTTP errors
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result;
}

async function promptLlama(prompt, temperature) {
  const payload = {
    inputs: prompt,
    parameters: {
      temperature: temperature,
      max_new_tokens: 1000,
      return_full_text: false,
    },
    options: { use_cache: false },
  };

  try {
    // Await the query to complete and then proceed
    const response = await query(payload);
    // Assuming you want to work with the response as a string elsewhere
    return response[0].generated_text;
  } catch (error) {
    console.error(error);
    // Return or throw the error based on how you want to handle it
    throw error; // or return something appropriate
  }
}

// Export function
module.exports.promptLlama = promptLlama;
