const OpenAI = require("openai");

// Define the base URL and the API key
const baseUrl = "http://localhost:1234/v1";
const apiKey = "not-needed";

// Define the body of the request
const requestBody = {
  model: "local-model",
  messages: [
    { role: "system", content: "Always answer in rhymes." },
    { role: "user", content: "Introduce yourself." },
  ],
  temperature: 0.7,
};

// Perform the POST request to the chat completions endpoint
fetch(`${baseUrl}/chat/completions`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`, // Authorization header, if needed
  },
  body: JSON.stringify(requestBody),
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data.choices[0].message);
  })
  .catch((error) => console.error("Error:", error));
