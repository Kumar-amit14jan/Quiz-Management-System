import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-4xl font-bold mb-4">Quiz Management System</h1>
      <p className="text-xl font-semibold mb-2 mb-8">Welcome to the Quiz Platform</p>
      
      <div className="mb-8">
        <Link 
          to="/create-quiz" 
          className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 px-6 rounded-xl shadow-md inline-block"
        >
          Create New Quiz
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-semibold mb-4">Available Quizzes</h2>
        
        {/* Quiz list container with placeholder quiz cards */}
        <div className="space-y-4 mb-4">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Sample Quiz 1</h3>
            <p className="text-gray-600 mb-4">This is a placeholder quiz card.</p>
            <Link 
              to="/quiz/1" 
              className="bg-[#c7f8ff] py-2 px-4 rounded-xl shadow-md inline-block"
            >
              Take Quiz
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Sample Quiz 2</h3>
            <p className="text-gray-600 mb-4">This is a placeholder quiz card.</p>
            <Link 
              to="/quiz/2" 
              className="bg-[#c7f8ff] py-2 px-4 rounded-xl shadow-md inline-block"
            >
              Take Quiz
            </Link>
          </div>
        </div>
        
        {/* Empty state placeholder */}
        <div className="text-center py-8 text-gray-500">
          <p>No quizzes available yet. Create your first quiz!</p>
        </div>
      </div>
    </div>
  );
}

export default Home;

