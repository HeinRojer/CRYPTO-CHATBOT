const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors");

const app = express();
const GEMINI_API_KEY = AIzaSyCfWYYC5JyRS9ALWGIaTyqUBQAqSzmPMmE; 
const PORT = 3000;

app.use(cors()); 
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite-preview-02-05", 
    });

    const prompt = `based on the given name of crypto currency, tell me its current price and predict its possible future value: ${question}`;

    const result = await model.generateContent(prompt);
    
    res.json({ answer: result.response.text() || "I couldn't find an answer." });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      error: error.message || "Failed to generate content",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});