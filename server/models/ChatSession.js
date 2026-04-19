const mongoose = require('mongoose');

const chatSessionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    scenario: {
      type: String,
      required: true,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ['user', 'model'],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        coaching: {
          tone: String,
          suggestion: String,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    avgToneScore: Number,
    avgProfessionalismScore: Number,
    isEnded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ChatSession', chatSessionSchema);
