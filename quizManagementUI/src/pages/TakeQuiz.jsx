import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../config/axios';

function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/quiz/${id}`);
        setQuiz(response.data);
        setSelectedAnswers(new Array(response.data.questions.length).fill(''));
        setError(null);
      } catch (err) {
        setError('Failed to load quiz. Please try in some time');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleAnswerSelect = (answer) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
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

  if (!quiz) return null;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

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
        
        {/* Option buttons */}
        {currentQuestion.type === 'MCQ' && (
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full py-3 px-6 rounded-xl shadow-md text-left transition-all ${
                  selectedAnswers[currentQuestionIndex] === option
                    ? 'bg-purple-100 border-2 border-purple-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'TrueFalse' && (
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleAnswerSelect('True')}
              className={`w-full py-3 px-6 rounded-xl shadow-md text-left transition-all ${
                selectedAnswers[currentQuestionIndex] === 'True'
                  ? 'bg-purple-100 border-2 border-purple-600'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              True
            </button>
            <button
              onClick={() => handleAnswerSelect('False')}
              className={`w-full py-3 px-6 rounded-xl shadow-md text-left transition-all ${
                selectedAnswers[currentQuestionIndex] === 'False'
                  ? 'bg-purple-100 border-2 border-purple-600'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              False
            </button>
          </div>
        )}

        {currentQuestion.type === 'Text' && (
          <div className="mb-6">
            <input
              type="text"
              value={selectedAnswers[currentQuestionIndex] || ''}
              onChange={(e) => handleAnswerSelect(e.target.value)}
              placeholder="Enter your answer"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Prev / Next / Submit buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <button 
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="bg-[#c7f8ff] py-3 px-6 rounded-xl shadow-md hover:bg-[#b0e8f0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <button 
              onClick={handleNext}
              className="bg-[#c7f8ff] py-3 px-6 rounded-xl shadow-md hover:bg-[#b0e8f0] transition-colors"
            >
              Next
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 px-6 rounded-xl shadow-md hover:from-purple-700 hover:to-purple-900 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TakeQuiz;

