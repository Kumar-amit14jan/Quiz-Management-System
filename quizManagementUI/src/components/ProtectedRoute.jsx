import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return (
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-700 mb-4">
            You need administrator privileges to access this page.
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Current role: <span className="font-semibold">{user?.role || ROLES.USER}</span>
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Only users with <span className="font-semibold text-purple-600">admin</span> role can create quizzes.
          </p>
          <a 
            href="/" 
            className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2 px-6 rounded-xl shadow-md inline-block hover:from-purple-700 hover:to-purple-900 transition-all"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

