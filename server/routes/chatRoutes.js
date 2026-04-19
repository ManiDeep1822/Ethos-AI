const express = require('express');
const router = express.Router();
const {
  startChat,
  sendMessage,
  getSessions,
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, startChat);
router.post('/message', protect, sendMessage);
router.get('/sessions', protect, getSessions);

module.exports = router;
