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

const mongoose = require('mongoose');
const memoryAnalysisSessions = [];

const saveSession = async (req, res) => {
  const { originalText, scores, toneLabel, highlights, improvedVersion, generalFeedback } = req.body;

  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let session = null;

    if (isDbConnected) {
      try {
        session = await AnalysisSession.create({
          userId: req.user.id || req.user._id,
          originalText,
          scores,
          toneLabel,
          highlights,
          improvedVersion,
          generalFeedback,
        });
      } catch (dbErr) {
        console.warn('⚠️ [Analyzer]: MongoDB save failed, storing in memory:', dbErr.message);
      }
    }

    if (!session) {
      session = {
        _id: 'analysis_' + Date.now(),
        userId: req.user.id || req.user._id,
        originalText,
        scores,
        toneLabel,
        highlights,
        improvedVersion,
        generalFeedback,
        createdAt: new Date().toISOString()
      };
      memoryAnalysisSessions.unshift(session);
    }

    res.status(201).json({
      success: true,
      data: session,
      message: 'Session saved successfully'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to save session' 
    });
  }
};

const getSessions = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let sessions = [];

    if (isDbConnected) {
      try {
        sessions = await AnalysisSession.find({ userId: req.user.id || req.user._id }).sort({ createdAt: -1 });
      } catch (dbErr) {
        console.warn('⚠️ [Analyzer]: MongoDB getSessions failed, reading memory:', dbErr.message);
      }
    }

    if (!sessions || sessions.length === 0) {
      const currentUserId = (req.user.id || req.user._id || '').toString();
      sessions = memoryAnalysisSessions.filter(
        (s) => (s.userId || '').toString() === currentUserId
      );
    }

    res.status(200).json({
      success: true,
      data: sessions,
      message: 'Sessions retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};


module.exports = {
  performAnalysis,
  saveSession,
  getSessions,
};
