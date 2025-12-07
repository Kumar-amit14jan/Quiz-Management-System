function CreateQuiz() {
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-4xl font-bold mb-4">Create New Quiz</h1>
      
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <label className="text-xl font-semibold mb-2 block">Quiz Title</label>
          <input 
            type="text" 
            placeholder="Enter quiz title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="mb-6">
          <label className="text-xl font-semibold mb-2 block">Description</label>
          <textarea 
            placeholder="Enter quiz description"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Add Question</h2>
          
          {/* Question text input */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Question Text</label>
            <input 
              type="text" 
              placeholder="Enter question"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Question type dropdown */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Question Type</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>MCQ</option>
              <option>TrueFalse</option>
              <option>Text</option>
            </select>
          </div>

          {/* MCQ: four option inputs + radio button for selecting correct answer */}
          <div className="mb-4 space-y-2">
            <label className="block mb-2 font-semibold">Options (MCQ)</label>
            <input 
              type="text" 
              placeholder="Option 1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input 
              type="text" 
              placeholder="Option 2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input 
              type="text" 
              placeholder="Option 3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input 
              type="text" 
              placeholder="Option 4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="mt-3">
              <label className="block mb-2 font-semibold">Correct Answer</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="radio" name="correct" className="mr-2" />
                  Option 1
                </label>
                <label className="flex items-center">
                  <input type="radio" name="correct" className="mr-2" />
                  Option 2
                </label>
                <label className="flex items-center">
                  <input type="radio" name="correct" className="mr-2" />
                  Option 3
                </label>
                <label className="flex items-center">
                  <input type="radio" name="correct" className="mr-2" />
                  Option 4
                </label>
              </div>
            </div>
          </div>

          {/* TrueFalse placeholder */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Correct Answer (True/False)</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="radio" name="trueFalse" className="mr-2" />
                True
              </label>
              <label className="flex items-center">
                <input type="radio" name="trueFalse" className="mr-2" />
                False
              </label>
            </div>
          </div>

          {/* Text answer placeholder */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Correct Answer (Text)</label>
            <input 
              type="text" 
              placeholder="Enter correct answer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Cyan "Add Question" button */}
          <button className="bg-[#c7f8ff] py-3 px-6 rounded-xl shadow-md">
            Add Question
          </button>
        </div>

        {/* Purple "Create Quiz" button */}
        <button className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 px-6 rounded-xl shadow-md">
          Create Quiz
        </button>
      </div>
    </div>
  );
}

export default CreateQuiz;

