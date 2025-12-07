import { Link } from 'react-router-dom';

function TakeQuiz() {
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="mb-4">
        <Link 
          to="/" 
          className="text-purple-600 hover:text-purple-800"
        >
          ← Back to Home
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-4">Take Quiz</h1>
      
      {/* Progress indicator placeholder */}
      <div className="mb-6">
        <div className="bg-gray-200 rounded-full h-2 mb-2">
          <div className="bg-purple-600 h-2 rounded-full" style={{ width: '33%' }}></div>
        </div>
        <p className="text-sm text-gray-600">Question 1 of 3</p>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Question text placeholder */}
        <h2 className="text-xl font-semibold mb-2">Question Placeholder</h2>
        <p className="text-lg mb-6">This is a placeholder question text. Select your answer below.</p>
        
        {/* Option buttons placeholder */}
        <div className="space-y-3 mb-6">
          <button className="w-full bg-gray-100 hover:bg-gray-200 py-3 px-6 rounded-xl shadow-md text-left transition-colors">
            Option A
          </button>
          <button className="w-full bg-gray-100 hover:bg-gray-200 py-3 px-6 rounded-xl shadow-md text-left transition-colors">
            Option B
          </button>
          <button className="w-full bg-gray-100 hover:bg-gray-200 py-3 px-6 rounded-xl shadow-md text-left transition-colors">
            Option C
          </button>
          <button className="w-full bg-gray-100 hover:bg-gray-200 py-3 px-6 rounded-xl shadow-md text-left transition-colors">
            Option D
          </button>
        </div>

        {/* Prev / Next / Submit buttons */}
        <div className="flex justify-between">
          <button className="bg-[#c7f8ff] py-3 px-6 rounded-xl shadow-md hover:bg-[#b0e8f0] transition-colors">
            Previous
          </button>
          <button className="bg-[#c7f8ff] py-3 px-6 rounded-xl shadow-md hover:bg-[#b0e8f0] transition-colors">
            Next
          </button>
          <button className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 px-6 rounded-xl shadow-md hover:from-purple-700 hover:to-purple-900 transition-colors">
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default TakeQuiz;

