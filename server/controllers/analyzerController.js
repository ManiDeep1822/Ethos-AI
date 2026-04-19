const AnalysisSession = require('../models/AnalysisSession');
const { analyzeText } = require('../services/geminiService');

// @desc    Analyze text using Gemini
// @route   POST /api/analyzer/analyze
// @access  Private
const performAnalysis = async (req, res) => {
  const { text } = req.body;

  if (!text || text.length < 10) {
    return res.status(400).json({ 
      success: false, 
      message: 'Text too short for analysis' 
    });
  }

  try {
    const analysis = await analyzeText(text);
    res.status(200).json({
      success: true,
      data: analysis,
      message: 'Analysis performed successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const saveSession = async (req, res) => {
  const { originalText, scores, toneLabel, highlights, improvedVersion, generalFeedback } = req.body;

  try {
    const session = await AnalysisSession.create({
      userId: req.user.id,
      originalText,
      scores,
      toneLabel,
      highlights,
      improvedVersion,
      generalFeedback,
    });
    res.status(201).json({
      success: true,
      data: session,
      message: 'Session saved successfully'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Failed to save session' 
    });
  }
};

const getSessions = async (req, res) => {
  try {
    const sessions = await AnalysisSession.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: sessions,
      message: 'Sessions retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};


module.exports = {
  performAnalysis,
  saveSession,
  getSessions,
};
