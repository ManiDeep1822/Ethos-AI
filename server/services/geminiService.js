const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const DEFAULT_ANALYSIS = {
  toneLabel: "Neutral",
  tone: 50,
  clarity: 50,
  professionalism: 50,
  conciseness: 50,
  empathy: 50,
  overall: 50,
  highlights: [],
  generalFeedback: "Analysis unavailable. Please ensure your input is clear.",
  improvedVersion: ""
};

const DEFAULT_COACHING = {
  tone: "Neutral",
  suggestion: "Keep practicing to refine your professional tone."
};

/**
 * Robustly santize Gemini response to extract lean JSON
 */
const sanitizeJson = (text) => {
  if (!text) return '';
  // Match content inside markdown json blocks or just the blocks themselves
  let cleaned = text.replace(/```json/gi, '').replace(/```/gi, '');
  
  // Find first '{' and last '}'
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned.trim();
};

/**
 * Robustly call Gemini with a retry mechanism (Pulse Guard)
 */
const callGeminiWithRetry = async (model, prompt, maxRetries = 4) => {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      lastError = error;
      const errorMessage = error.message || '';
      const isRetryable = errorMessage.includes('503') || errorMessage.includes('429') || errorMessage.includes('overloaded');
      
      if (isRetryable && attempt < maxRetries) {
        const delay = attempt * 1500; // 1.5s, 3s, 4.5s backoff
        console.warn(`Gemini API Busy (Attempt ${attempt}/${maxRetries}). Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

/**
 * Perform deep text analysis via Gemini
 */
const analyzeText = async (userText) => {
  const modelId = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const model = genAI.getGenerativeModel({ model: modelId });

  // Escape user text to prevent JSON or prompt injection
  const escapedText = JSON.stringify(userText);

  const prompt = `
    Analyze this professional communication draft as an expert Human Resources (HR) Director coaching the user. 
    Return ONLY a valid JSON object with NO extra text.
    
    Structure:
    {
      "toneLabel": "string (e.g. Assertive, Empathetic, Formal)",
      "tone": 0-100,
      "clarity": 0-100,
      "professionalism": 0-100,
      "conciseness": 0-100,
      "empathy": 0-100,
      "overall": 0-100,
      "highlights": [{"text": "original phrase", "issue": "desc", "suggestion": "fix"}],
      "generalFeedback": "string summary",
      "improvedVersion": "fully rewritten polished version"
    }

    Text to analyze: ${escapedText}
  `;

  try {
    const text = await callGeminiWithRetry(model, prompt);
    const cleaned = sanitizeJson(text);
    
    try {
      const parsed = JSON.parse(cleaned);
      
      // Resilient Mapping: Merge with defaults to handle missing AI fields
      const finalAnalysis = {
        ...DEFAULT_ANALYSIS,
        ...parsed,
        // Ensure nested highlights is actually an array
        highlights: Array.isArray(parsed.highlights) ? parsed.highlights : []
      };

      // Clamp scores
      ['tone', 'clarity', 'professionalism', 'conciseness', 'empathy', 'overall'].forEach(f => {
        finalAnalysis[f] = Number(finalAnalysis[f]) || 50;
        finalAnalysis[f] = Math.max(0, Math.min(100, finalAnalysis[f]));
      });

      return finalAnalysis;
    } catch (parseErr) {
      console.error('Gemini Parse Error:', parseErr, 'Raw Text:', text);
      return { ...DEFAULT_ANALYSIS, improvedVersion: userText };
    }
  } catch (error) {
    console.error('Gemini API Error after retries:', error.message);
    return { ...DEFAULT_ANALYSIS, improvedVersion: userText };
  }
};

/**
 * Perform interactive chat simulation with coaching
 */
const chatReply = async (history, scenario, userData = {}) => {
  const modelId = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  
  const scenarioInstructions = {
    'Email Reply': 'You are a Human Resources (HR) representative. Respond professionally to the user\'s email.',
    'Job Interview': 'You are a Senior HR Hiring Manager. Conduct a high-stakes behavioral interview.',
    'Conflict Resolution': 'You are an HR Business Partner mediating a tense workplace conflict.',
    'Workplace Conflict': 'You are an HR Business Partner mediating a tense workplace conflict.',
    'Executive Brief': 'You are an HR Executive reviewing a sensitive personnel report.'
  };

  const systemInstruction = `
    User Identity:
    Name: ${userData.name || 'User'}
    Email: ${userData.email || 'Unknown'}

    Scenario Context: ${scenarioInstructions[scenario] || 'Professional communication coaching'}
    
    Instruction: Act in character as the counter-party in the scenario. 
    You are aware that you are talking to ${userData.name}. You should address them naturally by name if the situation warrants it (like greetings or formal feedback).

    For every turn, you MUST return a valid JSON object containing exactly two keys:
    1. "reply": Your in-character response text.
    2. "coaching": An object { "tone": "string", "suggestion": "string coaching for the USER'S PREVIOUS message" }.

    Return ONLY the JSON.
  `;

  // Initialize model with system instruction (CORRECT SDK USAGE)
  const model = genAI.getGenerativeModel({ 
    model: modelId,
    systemInstruction: systemInstruction 
  });

  try {
    const prompt = history.length === 0 
      ? "Start the conversation with a professional greeting." 
      : `Conversation History: ${JSON.stringify(history.slice(-5))}\n\nUser's latest message: ${history[history.length - 1].content}`;

    const text = await callGeminiWithRetry(model, prompt);
    const cleaned = sanitizeJson(text);
    
    try {
      const parsed = JSON.parse(cleaned);
      return {
        reply: parsed.reply || "Strategic response processing...",
        coaching: parsed.coaching || DEFAULT_COACHING
      };
    } catch (parseErr) {
      console.error('Gemini Chat Parse Error:', parseErr, 'Raw:', text);
      return { 
        reply: text.length > 500 ? text.substring(0, 500) + '...' : text, 
        coaching: DEFAULT_COACHING 
      };
    }
  } catch (error) {
    console.error('Gemini Chat Critical Error after retries:', error.message);
    return { 
      reply: "I'm having trouble connecting right now. Please wait a moment and try sending your message again.", 
      coaching: DEFAULT_COACHING 
    };
  }
};

module.exports = {
  analyzeText,
  chatReply,
};

