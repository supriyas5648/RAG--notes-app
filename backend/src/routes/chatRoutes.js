const express = require('express');
const { askQuestionHandler } = require('../controllers/chatController');

const router = express.Router();

// POST /api/chat/ask - Ask a question and get answer with RAG
router.post('/ask', askQuestionHandler);

module.exports = router;
