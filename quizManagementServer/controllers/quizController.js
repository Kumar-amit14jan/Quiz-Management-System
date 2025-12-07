const Quiz = require('../models/quizSchema');

// Validation helpers
const validateQuizData = (title, description, questions) => {
  if (!title || !title.trim()) {
    return 'Title is required';
  }
  if (!description || !description.trim()) {
    return 'Description is required';
  }
  if (!Array.isArray(questions)) {
    return 'Questions must be an array';
  }
  if (questions.length === 0) {
    return 'At least one question is required';
  }
  return null;
};

const createQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    // Validate required fields
    const validationError = validateQuizData(title, description, questions);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Save quiz to MongoDB
    const quiz = new Quiz({
      title: title.trim(),
      description: description.trim(),
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

// Helper function to calculate quiz results
const calculateQuizResults = (quiz, answers) => {
  let score = 0;
  const total = quiz.questions.length;
  const review = [];

  quiz.questions.forEach((question, index) => {
    const selectedAnswer = answers[index] || '';
    const correctAnswer = question.correctAnswer;
    const isCorrect = selectedAnswer.trim() === correctAnswer.trim();

    if (isCorrect) {
      score++;
    }

    review.push({
      questionText: question.questionText,
      selectedAnswer: selectedAnswer || 'No answer provided',
      correctAnswer: correctAnswer,
      isCorrect: isCorrect
    });
  });

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return { score, total, percentage, review };
};

const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;

    // Validate answers
    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers must be an array' });
    }

    // Load quiz by ID
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Validate answers length matches questions
    if (answers.length !== quiz.questions.length) {
      return res.status(400).json({ 
        error: `Expected ${quiz.questions.length} answers, received ${answers.length}` 
      });
    }

    // Calculate results
    const results = calculateQuizResults(quiz, answers);

    // Return results
    res.status(200).json(results);
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

