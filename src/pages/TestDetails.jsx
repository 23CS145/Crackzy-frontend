import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetTestByIdQuery } from '../slices/testsApiSlice';
import { useSelector } from 'react-redux';

const TestDetails = () => {
  const { id } = useParams();
  const { data: test, isLoading, error } = useGetTestByIdQuery(id);
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
    test?.questions?.forEach((question, qIndex) => {
      const selectedOptionIndex = selectedOptions[qIndex];
      if (
        selectedOptionIndex !== undefined &&
        question.options[selectedOptionIndex]?.isCorrect
      ) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setShowResults(true);
  };

  if (isLoading) return <div className="loading-message">Loading test...</div>;
  if (error) return <div className="error-message">Error: {error.message}</div>;
  if (!test) return <div className="error-message">Test not found</div>;

  return (
    <div className="container">
      <div className="test-header">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline"
        >
          &larr; Back to Tests
        </button>
        <h1 className="test-title">{test.title}</h1>
      </div>

      <div className="test-description">
        <p>{test.description}</p>
        <div className="test-meta">
          <span>Created by: {test.createdBy?.name || 'Unknown'}</span>
          <span>Duration: {test.duration} minutes</span>
        </div>
      </div>

      {!showResults ? (
        <div className="test-question-container">
          <div className="test-question-header">
            <h2>
              Question {currentQuestionIndex + 1} of {test.questions?.length || 0}
            </h2>
            <div className="test-navigation">
              {currentQuestionIndex > 0 && (
                <button
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                  className="btn btn-outline"
                >
                  Previous
                </button>
              )}
              {currentQuestionIndex < (test.questions?.length || 0) - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                  className="btn"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={calculateScore}
                  className="btn btn-success"
                >
                  Submit Test
                </button>
              )}
            </div>
          </div>

          <div className="test-question-content">
            <h3>{test.questions?.[currentQuestionIndex]?.questionText}</h3>
            <div className="test-options">
              {test.questions?.[currentQuestionIndex]?.options?.map(
                (option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`test-option ${
                      selectedOptions[currentQuestionIndex] === optionIndex ? 'selected' : ''
                    }`}
                    onClick={() => handleOptionSelect(currentQuestionIndex, optionIndex)}
                  >
                    {option.optionText}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="test-pagination">
            {test.questions?.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`pagination-dot ${
                  selectedOptions[index] !== undefined ? 'answered' : ''
                } ${currentQuestionIndex === index ? 'active' : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="test-results">
          <h2 className="results-title">Test Results</h2>
          <div className="results-score">
            <div>
              <span className="score">{score}</span>
              <span className="total">/{test.questions?.length || 0}</span>
            </div>
            <div className="percentage">
              {Math.round((score / (test.questions?.length || 1)) * 100)}%
            </div>
          </div>

          <div className="results-details">
            {test.questions?.map((question, qIndex) => {
              const selectedOptionIndex = selectedOptions[qIndex];
              const isCorrect =
                selectedOptionIndex !== undefined &&
                question.options[selectedOptionIndex]?.isCorrect;
              const correctOption = question.options?.find(opt => opt.isCorrect);

              return (
                <div
                  key={qIndex}
                  className={`result-item ${
                    isCorrect ? 'correct' : 'incorrect'
                  }`}
                >
                  <h3>
                    Question {qIndex + 1}: {question.questionText}
                  </h3>
                  <div className="result-answer">
                    <span>Your answer:</span>{' '}
                    <span className={isCorrect ? 'correct-text' : 'incorrect-text'}>
                      {selectedOptionIndex !== undefined
                        ? question.options[selectedOptionIndex]?.optionText || 'Not answered'
                        : 'Not answered'}
                    </span>
                  </div>
                  {!isCorrect && correctOption && (
                    <div className="correct-answer">
                      <span>Correct answer:</span>{' '}
                      <span className="correct-text">{correctOption.optionText}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="results-actions">
            <button
              onClick={() => {
                setShowResults(false);
                setCurrentQuestionIndex(0);
                setSelectedOptions({});
              }}
              className="btn"
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