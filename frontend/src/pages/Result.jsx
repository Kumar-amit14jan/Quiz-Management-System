import { Link } from 'react-router-dom';

function Result() {
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-4xl font-bold mb-4">Quiz Results</h1>
      
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        {/* Score placeholder */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-600 mb-2">Score: 8/10</h2>
          {/* Percentage placeholder */}
          <p className="text-xl font-semibold mb-2">Percentage: 80%</p>
        </div>
      </div>

      {/* Review section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-semibold mb-4">Review</h2>
        
        <div className="space-y-4">
          {/* Correct answers → green tinted card */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Question 1</h3>
            <p className="mb-2">What is the capital of France?</p>
            <div className="space-y-1">
              <p className="text-sm"><span className="font-semibold">Your Answer:</span> Paris</p>
              <p className="text-sm"><span className="font-semibold">Correct Answer:</span> Paris</p>
              <p className="text-green-600 font-semibold">✓ Correct</p>
            </div>
          </div>

          {/* Wrong answers → red tinted card */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Question 2</h3>
            <p className="mb-2">What is 2 + 2?</p>
            <div className="space-y-1">
              <p className="text-sm"><span className="font-semibold">Your Answer:</span> 5</p>
              <p className="text-sm"><span className="font-semibold">Correct Answer:</span> 4</p>
              <p className="text-red-600 font-semibold">✗ Incorrect</p>
            </div>
          </div>

          {/* Another correct answer - green tinted */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Question 3</h3>
            <p className="mb-2">True or False: The Earth is round.</p>
            <div className="space-y-1">
              <p className="text-sm"><span className="font-semibold">Your Answer:</span> True</p>
              <p className="text-sm"><span className="font-semibold">Correct Answer:</span> True</p>
              <p className="text-green-600 font-semibold">✓ Correct</p>
            </div>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="mt-6 text-center">
        <Link 
          to="/" 
          className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 px-6 rounded-xl shadow-md inline-block hover:from-purple-700 hover:to-purple-900 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Result;

