const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Config } = require("../config/config");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(Config.GEMINI_API_KEY);

async function callGemini(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" }); // use supported model
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Gemini API Error:", err);
    return "❌ Gemini failed to respond.";
  }
}

module.exports = { callGemini };
