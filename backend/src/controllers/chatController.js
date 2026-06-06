const { askQuestion } = require('../services/ragService');

// Handle user question and return answer using RAG pipeline
const askQuestionHandler = async (req, res, next) => {
  try {
    const { question, topK = 5 } = req.body;

    // Validate question
    if (!question || question.trim().length === 0) {
      const error = new Error('Question is required');
      error.status = 400;
      throw error;
    }

    // Execute RAG pipeline
    const result = await askQuestion(question, topK);

    res.status(200).json({
      success: true,
      data: {
        question,
        answer: result.answer,
        sources: result.sources,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  askQuestionHandler,
};
