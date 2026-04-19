require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function modernTest() {
  const apiKey = process.env.GOOGLE_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const modelsToTest = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-pro-exp",
    "gemini-1.0-pro"
  ];

  for (const m of modelsToTest) {
    try {
      console.log(`--- Testing '${m}' ---`);
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("Hi");
      console.log(`SUCCESS with '${m}':`, (await result.response).text().substring(0, 20));
      process.exit(0); 
    } catch (error) {
       console.log(`FAILED '${m}': ${error.message}`);
    }
  }
}

modernTest();
