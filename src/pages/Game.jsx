import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  useGetQuizQuestionsQuery,
  useSubmitQuizAnswersMutation,
} from '../slices/gameApiSlice';

const Game = () => {
  const { data: questions, isLoading, error, refetch } = useGetQuizQuestionsQuery();
  const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizAnswersMutation();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleOptionSelect = (questionIndex, optionIndex) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionIndex]: optionIndex,
    });
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(selectedOptions).length !== questions?.length) {
      toast.warning('Please answer all questions before submitting');
      return;
    }
  
    try {
      const answers = questions.map((question, index) => ({
        questionId: question._id.toString(), // Ensure ID is string
        selectedOption: selectedOptions[index]
      }));
  
      const results = await submitQuiz({ answers }).unwrap();
      setQuizResults(results);
      setShowResults(true);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptions({});
    setShowResults(false);
    setQuizResults(null);
    refetch();
  };

  if (isLoading) return <div className="loading-message">Loading quiz...</div>;
  if (error) return <div className="error-message">Error: {error.message}</div>;

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Gamified Quiz</h1>

      {!showResults ? (
        <div className="quiz-card">
          <div className="quiz-header">
            <h2>
              Question {currentQuestionIndex + 1} of {questions?.length}
            </h2>
            <div className="quiz-navigation">
              {currentQuestionIndex > 0 && (
                <button
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                  className="btn btn-outline"
                >
                  Previous
                </button>
              )}
              {currentQuestionIndex < questions?.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                  className="btn"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                  className="btn btn-success"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                </button>
              )}
            </div>
          </div>

          <div className="quiz-question">
            <h3>{questions[currentQuestionIndex].questionText}</h3>
            <div className="quiz-options">
              {questions[currentQuestionIndex].options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className={`quiz-option ${
                    selectedOptions[currentQuestionIndex] === optionIndex ? 'selected' : ''
                  }`}
                  onClick={() => handleOptionSelect(currentQuestionIndex, optionIndex)}
                >
                  {option.optionText}
                </div>
              ))}
            </div>
          </div>

          <div className="quiz-pagination">
            {questions.map((_, index) => (
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
        <div className="results-card">
          <h2>Quiz Results</h2>
          <div className="results-score">
            <div>{quizResults.score} / {quizResults.totalQuestions}</div>
            <div>{quizResults.percentage}%</div>
          </div>

          <div className="results-details">
            {quizResults.results.map((result, index) => (
              <div
                key={index}
                className={`result-item ${
                  result.isCorrect ? 'correct' : 'incorrect'
                }`}
              >
                <h3>
                  Question {index + 1}: {result.questionText}
                </h3>
                <div>
                  <span>Your answer:</span>{' '}
                  <span className={result.isCorrect ? 'correct-text' : 'incorrect-text'}>
                    {result.selectedOption}
                  </span>
                </div>
                {!result.isCorrect && (
                  <div>
                    <span>Correct answer:</span>{' '}
                    <span className="correct-text">{result.correctOption}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="results-actions">
            <button onClick={resetQuiz} className="btn">
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;