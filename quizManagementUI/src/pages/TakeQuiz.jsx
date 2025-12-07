import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../config/axios';

// Constants
const QUESTION_TYPES = {
  MCQ: 'MCQ',
  TRUEFALSE: 'TrueFalse',
  TEXT: 'Text'
};

// Helper functions
const initializeAnswers = (questionCount) => {
  return new Array(questionCount).fill('');
};

const calculateProgress = (currentIndex, total) => {
  return ((currentIndex + 1) / total) * 100;
};

// Render question inputs based on type
const renderQuestionInputs = (question, selectedAnswer, onSelect) => {
  const buttonBaseClass = "w-full py-3 px-6 rounded-xl shadow-md text-left transition-all";
  const selectedClass = "bg-purple-100 border-2 border-purple-600";
  const unselectedClass = "bg-gray-100 hover:bg-gray-200";

  if (question.type === QUESTION_TYPES.MCQ) {
    return (
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(option)}
            className={`${buttonBaseClass} ${
              selectedAnswer === option ? selectedClass : unselectedClass
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }

  if (question.type === QUESTION_TYPES.TRUEFALSE) {
    return (
      <div className="space-y-3 mb-6">
        {['True', 'False'].map((value) => (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className={`${buttonBaseClass} ${
              selectedAnswer === value ? selectedClass : unselectedClass
            }`}
          >
            {value}
          </button>
        ))}
      </div>
    );
  }

  if (question.type === QUESTION_TYPES.TEXT) {
    return (
      <div className="mb-6">
        <input
          type="text"
          value={selectedAnswer || ''}
          onChange={(e) => onSelect(e.target.value)}
          placeholder="Enter your answer"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
    );
  }

  return null;
};

function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch quiz on mount
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/quiz/${id}`);
        setQuiz(response.data);
        setSelectedAnswers(initializeAnswers(response.data.questions.length));
      } catch (err) {
        setError('Failed to load quiz. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuiz();
    }
  }, [id]);

  // Handlers
  const handleAnswerSelect = (answer) => {
    setSelectedAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = answer;
      return newAnswers;
    });
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    if (quiz) {
      setCurrentQuestionIndex(prev => 
        Math.min(quiz.questions.length - 1, prev + 1)
      );
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    
    try {
      const response = await api.post(`/quiz/${id}/submit`, {
        answers: selectedAnswers
      });
      navigate('/result', { state: response.data });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Computed values
  const currentQuestion = useMemo(() => {
    return quiz?.questions[currentQuestionIndex] || null;
  }, [quiz, currentQuestionIndex]);

  const progress = useMemo(() => {
    return quiz ? calculateProgress(currentQuestionIndex, quiz.questions.length) : 0;
  }, [quiz, currentQuestionIndex]);

  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = quiz && currentQuestionIndex === quiz.questions.length - 1;

  // Loading state
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-2 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Error state (before quiz loads)
  if (error && !quiz) {
    return (
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600">{error}</p>
          <Link to="/" className="text-purple-600 hover:text-purple-800 mt-2 inline-block">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!quiz || !currentQuestion) return null;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 animate-fade-in">
      <div className="mb-4">
        <Link 
          to="/" 
          className="text-purple-600 hover:text-purple-800 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-4">{quiz.title}</h1>
      
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </p>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-semibold mb-2">Question {currentQuestionIndex + 1}</h2>
        <p className="text-lg mb-6">{currentQuestion.questionText}</p>
        
        {/* Render question inputs based on type */}
        {renderQuestionInputs(currentQuestion, selectedAnswers[currentQuestionIndex], handleAnswerSelect)}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <button 
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            className="bg-[#c7f8ff] py-3 px-6 rounded-xl shadow-md hover:bg-[#b0e8f0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {isLastQuestion ? (
            <button 
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 px-6 rounded-xl shadow-md hover:from-purple-700 hover:to-purple-900 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="bg-[#c7f8ff] py-3 px-6 rounded-xl shadow-md hover:bg-[#b0e8f0] transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TakeQuiz;

