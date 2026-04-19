require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  const apiKey = process.env.GOOGLE_API_KEY;
  const modelId = process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest';
  
  console.log(`Testing with Model: ${modelId}`);
  console.log(`API Key prefix: ${apiKey ? apiKey.substring(0, 5) + '...' : 'MISSING'}`);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelId });

  try {
    const result = await model.generateContent("Say 'Node Online'");
    const response = await result.response;
    console.log("SUCCESS:", response.text());
  } catch (error) {
    console.error("FAILURE:", error.message);
    if (error.response) console.error("Response:", error.response);
  }
}

testGemini();
