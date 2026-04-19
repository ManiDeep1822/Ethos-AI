const mongoose = require('mongoose');

const analysisSessionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalText: {
      type: String,
      required: true,
    },
    scores: {
      tone: Number,
      clarity: Number,
      professionalism: Number,
      conciseness: Number,
      empathy: Number,
      overall: Number,
    },
    toneLabel: String,
    highlights: [
      {
        text: String,
        issue: String,
        suggestion: String,
      },
    ],
    improvedVersion: String,
    generalFeedback: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AnalysisSession', analysisSessionSchema);
