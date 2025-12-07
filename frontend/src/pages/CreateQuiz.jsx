import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';

function CreateQuiz() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Current question form state
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    type: 'MCQ',
    options: ['', '', '', ''],
    correctAnswer: ''
  });

  const handleQuestionTypeChange = (type) => {
    if (type === 'TrueFalse') {
      setCurrentQuestion({
        ...currentQuestion,
        type: 'TrueFalse',
        options: [],
        correctAnswer: ''
      });
    } else if (type === 'Text') {
      setCurrentQuestion({
        ...currentQuestion,
        type: 'Text',
        options: [],
        correctAnswer: ''
      });
    } else {
      setCurrentQuestion({
        ...currentQuestion,
        type: 'MCQ',
        options: ['', '', '', ''],
        correctAnswer: ''
      });
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.questionText.trim()) {
      setError('Question text is required');
      return;
    }

    if (currentQuestion.type === 'MCQ') {
      if (currentQuestion.options.some(opt => !opt.trim())) {
        setError('All MCQ options must be filled');
        return;
      }
      if (!currentQuestion.correctAnswer) {
        setError('Please select a correct answer');
        return;
      }
    } else if (currentQuestion.type === 'TrueFalse') {
      if (!currentQuestion.correctAnswer) {
        setError('Please select True or False');
        return;
      }
    } else if (currentQuestion.type === 'Text') {
      if (!currentQuestion.correctAnswer.trim()) {
        setError('Correct answer is required');
        return;
      }
    }

    setError(null);
    const questionToAdd = {
      questionText: currentQuestion.questionText,
      type: currentQuestion.type,
      options: currentQuestion.type === 'MCQ' ? currentQuestion.options : [],
      correctAnswer: currentQuestion.correctAnswer
    };

    setQuestions([...questions, questionToAdd]);
    setCurrentQuestion({
      questionText: '',
      type: 'MCQ',
      options: ['', '', '', ''],
      correctAnswer: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required');
      return;
    }

    if (questions.length === 0) {
      setError('Please add at least one question');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post('/quiz/create', {
        title,
        description,
        questions
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 animate-fade-in">
      <h1 className="text-4xl font-bold mb-4">Create New Quiz</h1>
      
      <div className="bg-white rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="text-xl font-semibold mb-2 block">Quiz Title</label>
            <input 
              type="text" 
              placeholder="Enter quiz title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="text-xl font-semibold mb-2 block">Description</label>
            <textarea 
              placeholder="Enter quiz description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Add Question</h2>
            
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Question Text</label>
              <input 
                type="text" 
                placeholder="Enter question"
                value={currentQuestion.questionText}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold">Question Type</label>
              <select 
                value={currentQuestion.type}
                onChange={(e) => handleQuestionTypeChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="MCQ">MCQ</option>
                <option value="TrueFalse">TrueFalse</option>
                <option value="Text">Text</option>
              </select>
            </div>

            {currentQuestion.type === 'MCQ' && (
              <div className="mb-4 space-y-2">
                <label className="block mb-2 font-semibold">Options (MCQ)</label>
                {currentQuestion.options.map((option, index) => (
                  <input 
                    key={index}
                    type="text" 
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ))}
                <div className="mt-3">
                  <label className="block mb-2 font-semibold">Correct Answer</label>
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                      <label key={index} className="flex items-center">
                        <input 
                          type="radio" 
                          name="correct" 
                          value={option}
                          checked={currentQuestion.correctAnswer === option}
                          onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                          className="mr-2"
                        />
                        {option || `Option ${index + 1}`}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentQuestion.type === 'TrueFalse' && (
              <div className="mb-4">
                <label className="block mb-2 font-semibold">Correct Answer (True/False)</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="trueFalse" 
                      value="True"
                      checked={currentQuestion.correctAnswer === 'True'}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                      className="mr-2"
                    />
                    True
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="trueFalse" 
                      value="False"
                      checked={currentQuestion.correctAnswer === 'False'}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                      className="mr-2"
                    />
                    False
                  </label>
                </div>
              </div>
            )}

            {currentQuestion.type === 'Text' && (
              <div className="mb-4">
                <label className="block mb-2 font-semibold">Correct Answer (Text)</label>
                <input 
                  type="text" 
                  placeholder="Enter correct answer"
                  value={currentQuestion.correctAnswer}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}

            <button 
              type="button"
              onClick={handleAddQuestion}
              className="bg-[#c7f8ff] py-3 px-6 rounded-xl shadow-md hover:bg-[#b0e8f0] transition-colors"
            >
              Add Question
            </button>
          </div>

          {questions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Added Questions ({questions.length})</h3>
              <div className="space-y-2">
                {questions.map((q, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium">{index + 1}. {q.questionText}</p>
                    <p className="text-xs text-gray-500">{q.type}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 px-6 rounded-xl shadow-md hover:from-purple-700 hover:to-purple-900 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Quiz'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateQuiz;

