require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function broadTest() {
  const apiKey = process.env.GOOGLE_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro",
    "gemini-1.0-pro"
  ];

  for (const m of modelsToTest) {
    try {
      console.log(`--- Testing '${m}' ---`);
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("Hi");
      console.log(`SUCCESS with '${m}':`, (await result.response).text().substring(0, 20));
      process.exit(0); // Stop at first success
    } catch (error) {
       console.log(`FAILED '${m}': ${error.message}`);
    }
  }
}

broadTest();
