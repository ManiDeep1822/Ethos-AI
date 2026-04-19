const express = require('express');
const router = express.Router();
const {
  performAnalysis,
  saveSession,
  getSessions,
} = require('../controllers/analyzerController');
const { protect } = require('../middleware/authMiddleware');

router.post('/analyze', protect, performAnalysis);
router.post('/save', protect, saveSession);
router.get('/sessions', protect, getSessions);

module.exports = router;
