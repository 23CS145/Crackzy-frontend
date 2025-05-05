import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetTestByIdQuery } from '../slices/testsApiSlice';
import { useSelector } from 'react-redux';

const TestDetails = () => {
  const { id } = useParams();
  const { data: test, isLoading, error } = useGetTestByIdQuery(id);
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionSelect = (questionIndex, optionIndex) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionIndex]: optionIndex,
    });
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    test.questions.forEach((question, qIndex) => {
      const selectedOptionIndex = selectedOptions[qIndex];
      if (
        selectedOptionIndex !== undefined &&
        question.options[selectedOptionIndex].isCorrect
      ) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setShowResults(true);
  };

  if (isLoading) return <div className="text-center">Loading test...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Tests
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">{test.title}</h1>
        <p className="text-gray-600 mb-4">{test.description}</p>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Created by: {test.createdBy.name}</span>
          <span>Duration: {test.duration} minutes</span>
        </div>
      </div>

      {!showResults ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Question {currentQuestionIndex + 1} of {test.questions.length}
            </h2>
            <div className="flex space-x-2">
              {currentQuestionIndex > 0 && (
                <button
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                >
                  Previous
                </button>
              )}
              {currentQuestionIndex < test.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={calculateScore}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Submit Test
                </button>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">
              {test.questions[currentQuestionIndex].questionText}
            </h3>
            <div className="space-y-3">
              {test.questions[currentQuestionIndex].options.map(
                (option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`p-4 border rounded-lg cursor-pointer ${
                      selectedOptions[currentQuestionIndex] === optionIndex
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleOptionSelect(currentQuestionIndex, optionIndex)}
                  >
                    {option.optionText}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {test.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedOptions[index] !== undefined
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200'
                } ${
                  currentQuestionIndex === index
                    ? 'ring-2 ring-blue-500'
                    : ''
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Test Results</h2>
          <div className="text-center mb-8">
            <div className="text-4xl font-bold mb-2">
              {score} / {test.questions.length}
            </div>
            <div className="text-xl">
              {Math.round((score / test.questions.length) * 100)}%
            </div>
          </div>

          <div className="space-y-6">
            {test.questions.map((question, qIndex) => {
              const selectedOptionIndex = selectedOptions[qIndex];
              const isCorrect =
                selectedOptionIndex !== undefined &&
                question.options[selectedOptionIndex].isCorrect;

              return (
                <div
                  key={qIndex}
                  className={`p-4 border rounded-lg ${
                    isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <h3 className="font-medium mb-2">
                    Question {qIndex + 1}: {question.questionText}
                  </h3>
                  <div className="mb-2">
                    <span className="font-medium">Your answer:</span>{' '}
                    {selectedOptionIndex !== undefined ? (
                      <span
                        className={isCorrect ? 'text-green-600' : 'text-red-600'}
                      >
                        {question.options[selectedOptionIndex].optionText}
                      </span>
                    ) : (
                      <span className="text-red-600">Not answered</span>
                    )}
                  </div>
                  {!isCorrect && (
                    <div>
                      <span className="font-medium">Correct answer:</span>{' '}
                      <span className="text-green-600">
                        {question.options.find((opt) => opt.isCorrect).optionText}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setShowResults(false);
                setCurrentQuestionIndex(0);
                setSelectedOptions({});
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Retake Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestDetails;