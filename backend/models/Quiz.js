const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['MCQ', 'TrueFalse', 'Text'],
    required: true
  },
  options: {
    type: [String],
    default: []
  },
  correctAnswer: {
    type: String,
    required: true
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  questions: {
    type: [questionSchema],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);

