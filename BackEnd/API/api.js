
/**
 * 
 * STILL WORKING ON THIS TO MAKE ANALYSIS EASIER & FASTER FROM A UI
 */

const express = require("express");
const app = express();
const port = 3000;
const { runAnalysis } = require("../main");

app.use(express.json()); // Middleware to parse JSON bodies

// Define endpoint 
app.post("/runanalysis", async (req, res) => {
  try {
    const data = req.body.data;
    const { url, accessibility_type, prompt_technique, temperature, model } =
      data;

    // wait for the result
    const result = await runAnalysis(
      url,
      accessibility_type,
      prompt_technique,
      temperature,
      model
    );

    // Send result back to client
    res.json({ result });
  } catch (error) {
    // Handle errors
    console.error("Error running analysis:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
