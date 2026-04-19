require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const apiKey = process.env.GOOGLE_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // Note: The SDK might not have a direct listModels() exposed easily in all versions, 
    // but the error message suggested it.
    // In @google/generative-ai, we usually just know the model names.
    // Let's try to fetch a known list or just test gemini-pro.
    console.log("Testing generic 'gemini-1.5-flash'...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Test");
    console.log("SUCCESS with gemini-1.5-flash");
  } catch (error) {
    console.error("FAILURE with gemini-1.5-flash:", error.message);
  }

  try {
    console.log("Testing 'gemini-1.5-pro-latest'...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    const result = await model.generateContent("Test");
    console.log("SUCCESS with gemini-1.5-pro-latest");
  } catch (error) {
    console.error("FAILURE with gemini-1.5-pro-latest:", error.message);
  }
}

listModels();
