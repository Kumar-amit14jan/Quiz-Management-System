import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../config/axios';
import { useAuth } from '../context/AuthContext';
import { ROLES, getRoleDisplayName } from '../constants/roles';

// Constants
const INITIAL_QUESTION = {
  questionText: '',
  type: 'MCQ',
  options: ['', '', '', ''],
  correctAnswer: ''
};

const QUESTION_TYPES = {
  MCQ: 'MCQ',
  TRUEFALSE: 'TrueFalse',
  TEXT: 'Text'
};

// Validation helpers
const validateQuestion = (question) => {
  if (!question.questionText.trim()) {
    return 'Question text is required';
  }

  if (question.type === QUESTION_TYPES.MCQ) {
    if (question.options.some(opt => !opt.trim())) {
      return 'All MCQ options must be filled';
    }
    if (!question.correctAnswer) {
      return 'Please select a correct answer';
    }
  } else if (question.type === QUESTION_TYPES.TRUEFALSE) {
    if (!question.correctAnswer) {
      return 'Please select True or False';
    }
  } else if (question.type === QUESTION_TYPES.TEXT) {
    if (!question.correctAnswer.trim()) {
      return 'Correct answer is required';
    }
  }

  return null;
};

const validateQuiz = (title, description, questions) => {
  if (!title.trim() || !description.trim()) {
    return 'Title and description are required';
  }
  if (questions.length === 0) {
    return 'Please add at least one question';
  }
  return null;
};

// Question type configuration
const getQuestionTypeConfig = (type) => {
  switch (type) {
    case QUESTION_TYPES.TRUEFALSE:
      return { type, options: [], correctAnswer: '' };
    case QUESTION_TYPES.TEXT:
      return { type, options: [], correctAnswer: '' };
    default:
      return { type: QUESTION_TYPES.MCQ, options: ['', '', '', ''], correctAnswer: '' };
  }
};

function CreateQuiz() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(INITIAL_QUESTION);

  const handleQuestionTypeChange = (type) => {
    setCurrentQuestion(prev => ({
      ...prev,
      ...getQuestionTypeConfig(type)
    }));
  };

  const handleOptionChange = (index, value) => {
    setCurrentQuestion(prev => {
      const newOptions = [...prev.options];
      newOptions[index] = value;
      return { ...prev, options: newOptions };
    });
  };

  const handleCorrectAnswerChange = (value) => {
    setCurrentQuestion(prev => ({ ...prev, correctAnswer: value }));
  };

  const resetQuestionForm = () => {
    setCurrentQuestion(INITIAL_QUESTION);
  };

  const handleAddQuestion = () => {
    const validationError = validateQuestion(currentQuestion);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    const questionToAdd = {
      questionText: currentQuestion.questionText,
      type: currentQuestion.type,
      options: currentQuestion.type === QUESTION_TYPES.MCQ ? currentQuestion.options : [],
      correctAnswer: currentQuestion.correctAnswer
    };

    setQuestions(prev => [...prev, questionToAdd]);
    resetQuestionForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateQuiz(title, description, questions);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post('/quiz/create', { title, description, questions });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render question type specific inputs
  const renderQuestionInputs = () => {
    if (currentQuestion.type === QUESTION_TYPES.MCQ) {
      return (
        <div className="mb-4 space-y-2">
          <label className="block mb-2 font-semibold">Options (MCQ)</label>
          {currentQuestion.options.map((option, index) => (
            <input 
              key={index}
              type="text" 
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          ))}
          <div className="mt-3">
            <label className="block mb-2 font-semibold">Correct Answer</label>
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <label key={index} className="flex items-center">
                  <input 
                    type="radio" 
                    name="correct" 
                    value={option}
                    checked={currentQuestion.correctAnswer === option}
                    onChange={(e) => handleCorrectAnswerChange(e.target.value)}
                    className="mr-2"
                  />
                  {option || `Option ${index + 1}`}
                </label>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (currentQuestion.type === QUESTION_TYPES.TRUEFALSE) {
      return (
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Correct Answer (True/False)</label>
          <div className="space-y-2">
            {['True', 'False'].map((value) => (
              <label key={value} className="flex items-center">
                <input 
                  type="radio" 
                  name="trueFalse" 
                  value={value}
                  checked={currentQuestion.correctAnswer === value}
                  onChange={(e) => handleCorrectAnswerChange(e.target.value)}
                  className="mr-2"
                />
                {value}
              </label>
            ))}
          </div>
        </div>
      );
    }

    if (currentQuestion.type === QUESTION_TYPES.TEXT) {
      return (
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Correct Answer (Text)</label>
          <input 
            type="text" 
            placeholder="Enter correct answer"
            value={currentQuestion.correctAnswer}
            onChange={(e) => handleCorrectAnswerChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      );
    }

    return null;
  };

  const inputClassName = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500";

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Link 
            to="/" 
            className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors inline-flex items-center mb-2"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">Create New Quiz</h1>
        </div>
        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-sm text-gray-700 font-medium block">
                {user?.username}
              </span>
              <span className={`text-xs font-semibold block ${
                user?.role === ROLES.ADMIN ? 'text-purple-600' : 'text-gray-500'
              }`}>
                {getRoleDisplayName(user?.role)}
              </span>
            </div>
            <button
              onClick={logout}
              className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit}>
          {/* Quiz Basic Info */}
          <div className="mb-6">
            <label className="text-xl font-semibold mb-2 block">Quiz Title</label>
            <input 
              type="text" 
              placeholder="Enter quiz title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClassName}
              required
            />
          </div>

          <div className="mb-6">
            <label className="text-xl font-semibold mb-2 block">Description</label>
            <textarea 
              placeholder="Enter quiz description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClassName}
              required
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Add Question Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Add Question</h2>
            
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Question Text</label>
              <input 
                type="text" 
                placeholder="Enter question"
                value={currentQuestion.questionText}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, questionText: e.target.value }))}
                className={inputClassName}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold">Question Type</label>
              <select 
                value={currentQuestion.type}
                onChange={(e) => handleQuestionTypeChange(e.target.value)}
                className={inputClassName}
              >
                <option value={QUESTION_TYPES.MCQ}>MCQ</option>
                <option value={QUESTION_TYPES.TRUEFALSE}>TrueFalse</option>
                <option value={QUESTION_TYPES.TEXT}>Text</option>
              </select>
            </div>

            {renderQuestionInputs()}

            <button 
              type="button"
              onClick={handleAddQuestion}
              className="bg-[#c7f8ff] py-3 px-6 rounded-xl shadow-md hover:bg-[#b0e8f0] transition-colors"
            >
              Add Question
            </button>
          </div>

          {/* Added Questions List */}
          {questions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Added Questions ({questions.length})</h3>
              <div className="space-y-2">
                {questions.map((q, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium">{index + 1}. {q.questionText}</p>
                    <p className="text-xs text-gray-500">{q.type}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 px-6 rounded-xl shadow-md hover:from-purple-700 hover:to-purple-900 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Quiz'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateQuiz;

