const express = require('express');
const router = express.Router();
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  submitQuiz
} = require('../controllers/quizController');

// Placeholder route handlers
router.post('/create', createQuiz);
router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);
router.post('/:id/submit', submitQuiz);

module.exports = router;

