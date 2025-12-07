import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/axios';

function Home() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await api.get('/quiz');
        setQuizzes(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load quizzes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 animate-fade-in">
      <h1 className="text-4xl font-bold mb-4">Quiz Management System</h1>
      <p className="text-xl font-semibold mb-2 mb-8">Welcome to the Quiz Platform</p>
      
      <div className="mb-8">
        <Link 
          to="/create-quiz" 
          className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 px-6 rounded-xl shadow-md inline-block hover:from-purple-700 hover:to-purple-900 transition-all transform hover:scale-105"
        >
          Create New Quiz
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-semibold mb-4">Available Quizzes</h2>
        
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-2 text-gray-600">Loading quizzes...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {quizzes.length > 0 ? (
              <div className="space-y-4">
                {quizzes.map((quiz) => (
                  <div 
                    key={quiz._id} 
                    className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow animate-fade-in"
                  >
                    <h3 className="text-lg font-semibold mb-2">{quiz.title}</h3>
                    <p className="text-gray-600 mb-4">{quiz.description}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      {quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}
                    </p>
                    <Link 
                      to={`/quiz/${quiz._id}`} 
                      className="bg-[#c7f8ff] py-2 px-4 rounded-xl shadow-md inline-block hover:bg-[#b0e8f0] transition-colors"
                    >
                      Take Quiz
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No quizzes available yet. Create your first quiz!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;

