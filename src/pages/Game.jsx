import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  useGetQuizQuestionsQuery,
  useSubmitQuizAnswersMutation,
  useGetQuizResultsQuery,
} from '../slices/gameApiSlice';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

const Game = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  
  const { userInfo } = useSelector((state) => state.auth);
  const { data: questionsData, isLoading, error, refetch } = useGetQuizQuestionsQuery({ category });
  const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizAnswersMutation();
  const { data: resultsData } = useGetQuizResultsQuery({ limit: 5 });

  const questions = questionsData?.data || [];
  const previousResults = resultsData?.data || [];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  useEffect(() => {
    refetch();
  }, [refetch, category]);

  const handleOptionSelect = (questionIndex, optionIndex) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionIndex]: optionIndex,
    });
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(selectedOptions).length !== questions.length) {
      toast.warning('Please answer all questions before submitting');
      return;
    }
  
    try {
      const answers = questions.map((question, index) => ({
        questionId: question._id.toString(),
        selectedOption: selectedOptions[index]
      }));

      const results = await submitQuiz({ answers }).unwrap();
      setQuizResults(results.data);
      setShowResults(true);
    } catch (err) {
      toast.error(err?.data?.error || err.error || 'Failed to submit quiz');
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
  if (error) return <div className="error-message">Error: {error.error || 'Failed to load quiz'}</div>;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1 className="quiz-title">
          {category ? `${category.toUpperCase()} Quiz` : 'General Knowledge Quiz'}
        </h1>
        <div className="quiz-category-selector">
          <a 
            href="/game" 
            className={!category ? 'active' : ''}
          >
            All Categories
          </a>
          <a 
            href="/game?category=rbi" 
            className={category === 'rbi' ? 'active' : ''}
          >
            RBI
          </a>
          <a 
            href="/game?category=sbi" 
            className={category === 'sbi' ? 'active' : ''}
          >
            SBI
          </a>
          <a 
            href="/game?category=ibps" 
            className={category === 'ibps' ? 'active' : ''}
          >
            IBPS
          </a>
          <a 
            href="/game?category=rrb" 
            className={category === 'rrb' ? 'active' : ''}
          >
            RRB
          </a>
          <a 
            href="/game?category=ssc" 
            className={category === 'ssc' ? 'active' : ''}
          >
            SSC
          </a>
          <a 
            href="/game?category=upsc" 
            className={category === 'upsc' ? 'active' : ''}
          >
            UPSC
          </a>
        </div>
      </div>

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
            <div className="question-meta">
              <span className="question-category">{questions[currentQuestionIndex]?.category}</span>
              <span className={`question-difficulty ${questions[currentQuestionIndex]?.difficulty?.toLowerCase()}`}>
                {questions[currentQuestionIndex]?.difficulty}
              </span>
            </div>
            <h3>{questions[currentQuestionIndex]?.questionText}</h3>
            <div className="quiz-options">
              {questions[currentQuestionIndex]?.options.map((option, optionIndex) => (
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
          {quizResults && (
            <>
              <div className="results-score">
                <div>{quizResults.score} / {quizResults.totalQuestions}</div>
                <div>{quizResults.percentage}%</div>
              </div>

              <div className="results-details">
                {quizResults.results.map((result, index) => (
                  <div
                    key={index}
                    className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}
                  >
                    <h3>Question {index + 1}: {result.questionText}</h3>
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
            </>
          )}

          <div className="results-actions">
            <button onClick={resetQuiz} className="btn">
              Play Again
            </button>
            <a href={`/game${category ? `?category=${category}` : ''}`} className="btn btn-outline">
              New Quiz
            </a>
          </div>
        </div>
      )}

      {previousResults.length > 0 && (
        <div className="previous-results">
          <h3>Your Previous Results</h3>
          <ul>
            {previousResults.map((result, index) => (
              <li key={index}>
                {result.score}/{result.totalQuestions} ({result.percentage}%) -{' '}
                {new Date(result.createdAt).toLocaleDateString()}
                {result.category && ` - ${result.category.toUpperCase()}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Game;