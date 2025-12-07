const express = require('express');
const router = express.Router();
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  submitQuiz
} = require('../controllers/quizController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);
router.post('/:id/submit', submitQuiz);

// Protected admin routes
router.post('/create', protect, adminOnly, createQuiz);

module.exports = router;

