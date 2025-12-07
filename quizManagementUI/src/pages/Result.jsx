import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect, useMemo } from 'react';

// Helper function to get result card styling
const getResultCardClass = (isCorrect) => {
  return isCorrect
    ? 'bg-green-50 border-green-200'
    : 'bg-red-50 border-red-200';
};

// Helper function to get status styling
const getStatusClass = (isCorrect) => {
  return isCorrect ? 'text-green-600' : 'text-red-600';
};

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const resultData = location.state;

  useEffect(() => {
    if (!resultData) {
      navigate('/', { replace: true });
    }
  }, [resultData, navigate]);

  // Memoize result data
  const { score, total, percentage, review } = useMemo(() => {
    return resultData || { score: 0, total: 0, percentage: 0, review: [] };
  }, [resultData]);

  if (!resultData) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 animate-fade-in">
      <h1 className="text-4xl font-bold mb-4">Quiz Results</h1>
      
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-600 mb-2">Score: {score}/{total}</h2>
          <p className="text-xl font-semibold mb-2">Percentage: {percentage}%</p>
        </div>
      </div>

      {/* Review section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-semibold mb-4">Review</h2>
        
        <div className="space-y-4">
          {review.map((item, index) => (
            <div
              key={index}
              className={`rounded-xl p-6 border-2 ${getResultCardClass(item.isCorrect)} animate-fade-in`}
            >
              <h3 className="text-lg font-semibold mb-2">Question {index + 1}</h3>
              <p className="mb-3 font-medium">{item.questionText}</p>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-semibold">Your Answer:</span> {item.selectedAnswer}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Correct Answer:</span> {item.correctAnswer}
                </p>
                <p className={`font-semibold ${getStatusClass(item.isCorrect)}`}>
                  {item.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back button */}
      <div className="mt-6 text-center">
        <Link 
          to="/" 
          className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 px-6 rounded-xl shadow-md inline-block hover:from-purple-700 hover:to-purple-900 transition-all transform hover:scale-105"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Result;

