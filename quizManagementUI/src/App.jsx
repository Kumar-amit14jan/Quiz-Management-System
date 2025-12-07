import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateQuiz from './pages/CreateQuiz';
import TakeQuiz from './pages/TakeQuiz';
import Result from './pages/Result';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/create-quiz" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <CreateQuiz />
              </ProtectedRoute>
            } 
          />
          <Route path="/quiz/:id" element={<TakeQuiz />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

