const ChatSession = require('../models/ChatSession');
const User = require('../models/User');
const { chatReply } = require('../services/geminiService');
const mongoose = require('mongoose');

// In-memory fallback map for offline database resiliency
const memorySessions = new Map();

// @desc    Start/Get chat session
// @route   POST /api/chat/start
// @access  Private
const startChat = async (req, res) => {
  const { scenario } = req.body;

  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let userName = req.user?.name || 'Executive Leader';
    let userEmail = req.user?.email || 'admin@ethos.ai';

    if (isDbConnected) {
      try {
        const user = await User.findById(req.user.id || req.user._id);
        if (user) {
          userName = user.name;
          userEmail = user.email;
        }
      } catch (e) {
        // Fallback to token identity
      }
    }

    // Generate in-character opening greeting from counterpart with zero placeholders
    const { reply, coaching } = await chatReply([], scenario, {
      name: userName,
      email: userEmail
    });

    const initialMessages = [
      {
        role: 'model',
        content: reply,
        coaching
      }
    ];

    let session;
    if (isDbConnected) {
      try {
        session = await ChatSession.create({
          userId: req.user.id || req.user._id,
          scenario,
          messages: initialMessages,
        });
      } catch (dbErr) {
        console.warn('⚠️ [Chat]: MongoDB session create failed, using memory store:', dbErr.message);
      }
    }

    if (!session) {
      const memId = 'session_' + Date.now();
      session = {
        _id: memId,
        id: memId,
        userId: req.user.id || req.user._id,
        scenario,
        messages: initialMessages,
        createdAt: new Date().toISOString()
      };
      memorySessions.set(memId, session);
    }

    res.status(201).json({
      success: true,
      data: session,
      message: 'Chat session started'
    });
  } catch (error) {
    console.error('Failed to start chat session:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to start chat session' 
    });
  }
};

const sendMessage = async (req, res) => {
  const { sessionId, content } = req.body;

  try {
    let session = null;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        session = await ChatSession.findById(sessionId);
      } catch (err) {
        // Fallback to memory
      }
    }

    if (!session) {
      session = memorySessions.get(sessionId);
    }

    if (!session) {
      return res.status(404).json({ 
        success: false, 
        message: 'Session not found' 
      });
    }

    let userName = req.user?.name || 'Executive Leader';
    let userEmail = req.user?.email || 'admin@ethos.ai';

    if (isDbConnected && session.userId) {
      try {
        const user = await User.findById(session.userId);
        if (user) {
          userName = user.name;
          userEmail = user.email;
        }
      } catch (e) {
        // Fallback to token identity
      }
    }

    session.messages.push({ role: 'user', content });

    const { reply, coaching } = await chatReply(session.messages, session.scenario, {
      name: userName,
      email: userEmail
    });

    session.messages.push({ role: 'model', content: reply, coaching });
    
    if (typeof session.save === 'function') {
      try {
        await session.save();
      } catch (saveErr) {
        console.warn('⚠️ [Chat]: MongoDB session save failed, keeping in memory:', saveErr.message);
      }
    } else {
      memorySessions.set(sessionId, session);
    }
    
    res.status(200).json({
      success: true,
      data: { reply, coaching },
      message: 'Message sent and reply received'
    });
  } catch (error) {
    console.error('Failed to send message:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to send message' 
    });
  }
};

const getSessions = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let sessions = [];

    if (isDbConnected) {
      try {
        sessions = await ChatSession.find({ userId: req.user.id || req.user._id }).sort({ createdAt: -1 });
      } catch (dbErr) {
        console.warn('⚠️ [Chat]: MongoDB getSessions failed, retrieving from memory:', dbErr.message);
      }
    }

    if (!sessions || sessions.length === 0) {
      const currentUserId = (req.user.id || req.user._id || '').toString();
      sessions = Array.from(memorySessions.values()).filter(
        (s) => (s.userId || '').toString() === currentUserId
      );
    }

    res.status(200).json({
      success: true,
      data: sessions,
      message: 'Chat sessions retrieved'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};

module.exports = {
  startChat,
  sendMessage,
  getSessions,
};
