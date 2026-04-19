const ChatSession = require('../models/ChatSession');
const User = require('../models/User');
const { chatReply } = require('../services/geminiService');

// @desc    Start/Get chat session
// @route   POST /api/chat/start
// @access  Private
const startChat = async (req, res) => {
  const { scenario } = req.body;

  try {
    const session = await ChatSession.create({
      userId: req.user.id,
      scenario,
      messages: [],
    });
    res.status(201).json({
      success: true,
      data: session,
      message: 'Chat session started'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to start chat session' 
    });
  }
};

const sendMessage = async (req, res) => {
  const { sessionId, content } = req.body;

  try {
    const session = await ChatSession.findById(sessionId);
    if (!session) return res.status(404).json({ 
      success: false, 
      message: 'Session not found' 
    });

    const user = await User.findById(session.userId);

    session.messages.push({ role: 'user', content });

    const { reply, coaching } = await chatReply(session.messages, session.scenario, {
      name: user?.name || 'User',
      email: user?.email
    });

    session.messages.push({ role: 'model', content: reply, coaching });
    
    await session.save();
    
    res.status(200).json({
      success: true,
      data: { reply, coaching },
      message: 'Message sent and reply received'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const getSessions = async (req, res) => {
  try {
    const sessions = await ChatSession.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: sessions,
      message: 'Chat sessions retrieved'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};


module.exports = {
  startChat,
  sendMessage,
  getSessions,
};
