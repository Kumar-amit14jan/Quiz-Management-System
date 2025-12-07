import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/axios';
import { useAuth } from '../context/AuthContext';
import { ROLES, getRoleDisplayName } from '../constants/roles';

function Home() {
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch quizzes on mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/quiz');
        setQuizzes(response.data);
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
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Quiz Management System</h1>
          <p className="text-xl font-semibold mb-2">Welcome to the Quiz Platform</p>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
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
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-purple-600 hover:text-purple-800 font-medium px-3 py-1 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors">
                Login
              </Link>
              <Link to="/register" className="text-sm text-purple-600 hover:text-purple-800 font-medium px-3 py-1 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
      
      {isAdmin() ? (
        <div className="mb-8">
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-purple-700">
              <span className="font-semibold">Admin Access:</span> You can create and manage quizzes.
            </p>
          </div>
          <Link 
            to="/create-quiz" 
            className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 px-6 rounded-xl shadow-md inline-block hover:from-purple-700 hover:to-purple-900 transition-all transform hover:scale-105"
          >
            Create New Quiz
          </Link>
        </div>
      ) : isAuthenticated ? (
        <div className="mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-700">
              <span className="font-semibold">User Access:</span> You can take quizzes. Only administrators can create quizzes.
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Guest Access:</span> You can view and take quizzes. 
              <Link to="/login" className="text-purple-600 hover:text-purple-800 font-semibold ml-1">
                Login
              </Link>
              {' '}or{' '}
              <Link to="/register" className="text-purple-600 hover:text-purple-800 font-semibold">
                Register
              </Link>
              {' '}to access all features.
            </p>
          </div>
        </div>
      )}

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

