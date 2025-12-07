const Quiz = require('../models/Quiz');

const createQuiz = async (req, res) => {
  try {
    // Extract { title, description, questions } from req.body
    const { title, description, questions } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    // Save quiz to MongoDB
    const quiz = new Quiz({
      title,
      description,
      questions: questions || []
    });

    const savedQuiz = await quiz.save();

    // Return saved quiz JSON
    res.status(201).json(savedQuiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllQuizzes = async (req, res) => {
  try {
    // Find all quizzes
    const quizzes = await Quiz.find();

    // Return array of quizzes
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getQuizById = async (req, res) => {
  try {
    // Find quiz by req.params.id
    const quiz = await Quiz.findById(req.params.id);

    // If not found → return 404
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Else return quiz JSON
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const submitQuiz = async (req, res) => {
  try {
    // Receive submitted answers array from frontend → req.body.answers
    const { answers } = req.body;

    // Load quiz by ID
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    let score = 0;
    const total = quiz.questions.length;
    const review = [];

    // For each question:
    quiz.questions.forEach((question, index) => {
      const selectedAnswer = answers[index];
      const correctAnswer = question.correctAnswer;
      const isCorrect = selectedAnswer === correctAnswer;

      // Calculate score
      if (isCorrect) {
        score++;
      }

      // Build review array
      review.push({
        questionText: question.questionText,
        selectedAnswer: selectedAnswer || 'No answer provided',
        correctAnswer: correctAnswer,
        isCorrect: isCorrect
      });
    });

    // Calculate percentage
    const percentage = Math.round((score / total) * 100);

    // Return: { score, total, percentage, review }
    res.status(200).json({
      score,
      total,
      percentage,
      review
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  submitQuiz
};

