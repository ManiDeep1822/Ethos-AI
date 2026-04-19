require('dotenv').config();
const { analyzeText } = require('../services/geminiService');

async function verifyAnalyzer() {
  console.log("--- Testing Text Analyzer with Complex Input ---");
  
  const complexText = `
    "Look," I said to the manager, "this project is a mess." 
    We REALLY need to fix it ASAP or we'll fail. 
    Can you please help? It's 😊 important!
  `;

  try {
    const start = Date.now();
    const result = await analyzeText(complexText);
    const duration = Date.now() - start;

    console.log(`\n✅ ANALYSIS SUCCESSFUL (${duration}ms)`);
    console.log(`\nTone Label: ${result.toneLabel}`);
    console.log(`Overall Score: ${result.overall}/100`);
    
    console.log(`\nHighlights found: ${result.highlights.length}`);
    result.highlights.forEach((h, i) => {
      console.log(`  ${i+1}. [Issue]: ${h.issue} -> [Suggestion]: ${h.suggestion}`);
    });

    console.log(`\nImproved Version Sneak Peak: "${result.improvedVersion.substring(0, 50)}..."`);
    
    // Check if defaults were used (which would mean a partial failure)
    if (result.generalFeedback === "Analysis unavailable. Please ensure your input is clear.") {
      console.warn("\n⚠️  WARNING: System fell back to DEFAULT_ANALYSIS. Check AI response formatting.");
    } else {
      console.log("\n💎 Result verified as HIGH-FIDELITY (Real AI content).");
    }

  } catch (error) {
    console.error("\n❌ ANALYSIS CRITICAL FAILURE:", error.message);
  }
}

verifyAnalyzer();
