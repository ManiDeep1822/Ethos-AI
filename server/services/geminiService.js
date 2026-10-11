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

const ARENA_PERSONAS = {
  'Job Interview': {
    name: 'Jonathan Reed',
    title: 'Executive Hiring Panel Chair',
    organization: 'Apex Global Executive Search & Leadership Committee',
    context: 'Conduct an intensive, high-stakes behavioral and strategic leadership interview. Evaluate crisis management, cross-functional mediation, and executive accountability.',
    greetingGuidance: 'Open the session with an authoritative, warm greeting introducing yourself as Jonathan Reed, Chair of the Executive Hiring Panel. Welcome the candidate to the senior leadership interview and invite them to begin.'
  },
  'Executive Brief': {
    name: 'Marcus Sterling',
    title: 'Managing Director & Board Member',
    organization: 'Apex Global Board of Directors',
    context: 'Scrutinize capital allocation, project delivery timelines, and operational ROI under intense executive skepticism. Challenge ungrounded claims or defensive deflection.',
    greetingGuidance: 'Open directly and firmly as Marcus Sterling, Managing Director and Board Member, asking for the leadership briefing on milestones and capital allocation.'
  },
  'Client Escalation': {
    name: 'Rachel Hayes',
    title: 'Chief Technology Officer',
    organization: 'Apex Global Tier-1 Enterprise Partner',
    context: 'You are an outraged enterprise client CTO addressing an unacceptable production outage and SLA breach. Demand concrete root cause accountability and remediation without letting the user deflect.',
    greetingGuidance: 'Open with immediate, sharp executive urgency as Rachel Hayes, CTO of Apex Global, addressing the catastrophic downtime and demanding immediate remediation.'
  },
  'Conflict Resolution': {
    name: 'David Chen',
    title: 'Head of Product Engineering',
    organization: 'Core Platform Engineering',
    context: 'Negotiate difficult roadmap sprint tradeoffs between security debt, technical debt, and business feature commitments.',
    greetingGuidance: 'Open professionally as David Chen, Head of Product Engineering, laying out the engineering capacity bottlenecks and asking how to resolve roadmap tradeoffs.'
  },
  'Compensation Review': {
    name: 'Victoria Vance',
    title: 'Corporate VP of People Operations',
    organization: 'Executive Talent & Total Rewards',
    context: 'Conduct a strategic compensation, role promotion, and equity allocation review. Expect rigorous data-backed metrics and measurable leadership impact.',
    greetingGuidance: 'Open warmly but with executive discernment as Victoria Vance, VP of People Operations, welcoming the leader to their strategic compensation and role review.'
  }
};

/**
 * Programmatic safeguard against any leaked template tokens or bracketed placeholders
 */
const sanitizePlaceholders = (text, persona = {}, userName = 'Executive Leader') => {
  if (!text || typeof text !== 'string') return '';
  let result = text;

  const personaName = persona.name || 'Jonathan Reed';
  const personaTitle = persona.title || 'Executive Director';
  const orgName = persona.organization || 'Apex Global';

  // 1. Direct persona name placeholders (e.g. [Your Name/Director's Name], [Your Name], [Director's Name], etc.)
  result = result.replace(/\[(?:Your\s*Name\/?Director's\s*Name|Your\s*Name|Director's\s*Name|Interviewer(?:'s)?(?:\s*Name)?|Panel\s*Chair(?:'s)?(?:\s*Name)?|Speaker(?:'s)?(?:\s*Name)?|Manager(?:'s)?(?:\s*Name)?)\]/gi, personaName);

  // 2. User/candidate placeholders (e.g. [Candidate Name], [User's Name], etc.)
  result = result.replace(/\[(?:User(?:'s)?(?:\s*Name)?|Candidate(?:'s)?(?:\s*Name)?|Executive(?:\s*Leader)?|Applicant(?:'s)?(?:\s*Name)?)\]/gi, userName);

  // 3. Organization/company placeholders
  result = result.replace(/\[(?:Company(?:\s*Name)?|Organization(?:\s*Name)?|Client(?:\s*Name)?|Firm(?:\s*Name)?)\]/gi, orgName);

  // 4. Role or Title placeholders
  result = result.replace(/\[(?:Your\s*Title|Director's\s*Title|Role|Position|Job\s*Title)\]/gi, personaTitle);

  // 5. Date placeholders
  result = result.replace(/\[(?:Insert\s*)?Date\]/gi, 'today');

  // 6. Generic catch-all for any lingering bracketed tokens like [Insert ...] or [Department]
  result = result.replace(/\[(?:Insert\s+)?([^\]]+)\]/gi, (match, inner) => {
    const lower = inner.toLowerCase();
    if (lower.includes('name')) return personaName;
    if (lower.includes('company') || lower.includes('client') || lower.includes('org')) return orgName;
    if (lower.includes('title') || lower.includes('role')) return personaTitle;
    if (lower.includes('date') || lower.includes('time')) return 'today';
    return inner.trim(); // strip surrounding brackets cleanly
  });

  return result;
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
 * Robustly call Gemini with multi-model fallback and backoff (Pulse Guard)
 */
const callGeminiWithFallback = async (prompt, systemInstruction = null) => {
  const candidateModels = [
    process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash'
  ];
  const uniqueModels = [...new Set(candidateModels)];

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('GOOGLE_API_KEY is not defined in process.env!');
  }
  const client = new GoogleGenerativeAI(apiKey);

  let lastError;
  for (const modelId of uniqueModels) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const model = client.getGenerativeModel({
          model: modelId,
          ...(systemInstruction ? { systemInstruction } : {})
        });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (error) {
        lastError = error;
        const msg = error.message || '';
        const isQuotaOrAvailability = msg.includes('429') || msg.includes('404') || msg.includes('Quota exceeded');
        
        if (isQuotaOrAvailability) {
          console.warn(`Model ${modelId} unavailable/exhausted (${msg.substring(0, 80)}...). Switching to fallback model...`);
          break; // break inner loop to try next model in uniqueModels
        }

        const isBusy = msg.includes('503') || msg.includes('overloaded');
        if (isBusy && attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 1500));
          continue;
        }
        break;
      }
    }
  }
  throw lastError;
};

/**
 * Perform deep text analysis via Gemini
 */
const analyzeText = async (userText) => {

  // Escape user text to prevent JSON or prompt injection
  const escapedText = JSON.stringify(userText);

  const prompt = `
    Analyze this professional communication draft as an expert Human Resources (HR) Director coaching the user. 
    Return ONLY a valid JSON object with NO extra text.
    
    CRITICAL MANDATE:
    When writing "improvedVersion", provide a fully polished, ready-to-dispatch executive rewrite.
    NEVER use bracketed placeholders such as [Your Name], [Company], [Department], [Date], [Title]. Write concrete, seamless sentences ready for real-world enterprise correspondence.

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
      "improvedVersion": "fully rewritten polished version without placeholders"
    }

    Text to analyze: ${escapedText}
  `;

  try {
    const text = await callGeminiWithFallback(prompt);
    const cleaned = sanitizeJson(text);
    
    try {
      const parsed = JSON.parse(cleaned);
      
      // Resilient Mapping: Merge with defaults to handle missing AI fields
      const finalAnalysis = {
        ...DEFAULT_ANALYSIS,
        ...parsed,
        // Ensure nested highlights is actually an array
        highlights: Array.isArray(parsed.highlights) ? parsed.highlights : [],
        improvedVersion: sanitizePlaceholders(parsed.improvedVersion || userText, {}, 'Executive Team')
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
  
  const persona = ARENA_PERSONAS[scenario] || {
    name: 'Jonathan Reed',
    title: 'Executive Hiring Panel Chair',
    organization: 'Apex Global Executive Search & Leadership Committee',
    context: 'Conduct an intensive, high-stakes behavioral and strategic leadership interview.',
    greetingGuidance: 'Open the session with an authoritative, warm greeting introducing yourself as Jonathan Reed, Chair of the Executive Hiring Panel. Welcome the candidate to the senior leadership interview and invite them to begin.'
  };

  const userName = userData.name || 'Executive Leader';

  const systemInstruction = `
    YOU ARE AN ENTERPRISE ROLEPLAY COUNTERPART.
    
    ASSIGNED COUNTERPART IDENTITY:
    Name: ${persona.name}
    Title: ${persona.title}
    Organization: ${persona.organization}

    THE USER YOU ARE SPEAKING WITH:
    Name: ${userName}
    Email: ${userData.email || 'Unknown'}

    SCENARIO OBJECTIVE & CONTEXT:
    ${persona.context}
    
    ABSOLUTE MANDATES:
    1. IN-CHARACTER ROLEPLAY: You are ${persona.name}, ${persona.title}. Embody this identity with complete conviction and consistent executive tone.
    2. STRICT BAN ON ALL PLACEHOLDERS:
       - NEVER use bracketed tokens, placeholders, or template variables under ANY circumstances.
       - NEVER write "[Your Name]", "[Director's Name]", "[Your Name/Director's Name]", "[Company Name]", "[Insert Date]", "[Candidate Name]", "[Candidate]", or anything in brackets.
       - Introduce yourself naturally by your actual name (${persona.name}) and title (${persona.title}).
       - Address the user naturally by their name (${userName}).
    3. REALISTIC EXECUTIVE EXCHANGE: Challenge assumptions, demand concrete specifics, and stay true to your high-stakes enterprise role.

    For every turn, you MUST return a valid JSON object containing exactly two keys:
    1. "reply": Your in-character response text (as ${persona.name}).
    2. "coaching": An object { "tone": "string", "suggestion": "string tactical evaluation of the user's communication" }.

    Return ONLY the JSON.
  `;

  try {
    const prompt = history.length === 0 
      ? `Start the simulation in character as ${persona.name}. ${persona.greetingGuidance} Absolutely no bracketed placeholders.` 
      : `Conversation History: ${JSON.stringify(history.slice(-5))}\n\nUser's latest message: ${history[history.length - 1].content}`;

    const text = await callGeminiWithFallback(prompt, systemInstruction);
    const cleaned = sanitizeJson(text);
    
    try {
      const parsed = JSON.parse(cleaned);
      const rawReply = parsed.reply || "Strategic response processing...";
      const cleanReply = sanitizePlaceholders(rawReply, persona, userName);

      return {
        reply: cleanReply,
        coaching: parsed.coaching || DEFAULT_COACHING
      };
    } catch (parseErr) {
      console.error('Gemini Chat Parse Error:', parseErr, 'Raw:', text);
      const fallbackText = text.length > 500 ? text.substring(0, 500) + '...' : text;
      return { 
        reply: sanitizePlaceholders(fallbackText, persona, userName), 
        coaching: DEFAULT_COACHING 
      };
    }
  } catch (error) {
    console.error('Gemini Chat Critical Error after retries:', error.message);
    return { 
      reply: `Good day, ${userName}. I'm ${persona.name}, ${persona.title}. We are experiencing a brief telemetry delay. Please re-send your last transmission to continue our session.`, 
      coaching: DEFAULT_COACHING 
    };
  }
};

module.exports = {
  analyzeText,
  chatReply,
};

