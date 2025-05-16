import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  useGetGamesQuery,
  useSubmitGameResultsMutation,
  useGetGameResultsQuery,
} from '../slices/gameApiSlice';
import { useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';

const Game = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const type = searchParams.get('type') || 'quiz';
  
  const { userInfo } = useSelector((state) => state.auth);
  const { data: gamesData, isLoading, error, refetch } = useGetGamesQuery({ category, type });
  const [submitGame, { isLoading: isSubmitting }] = useSubmitGameResultsMutation();
  const { data: resultsData } = useGetGameResultsQuery({ limit: 5 });

  const games = gamesData?.data || [];
  const previousResults = resultsData?.data || [];

  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [gameResults, setGameResults] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);

  useEffect(() => {
    refetch();
  }, [refetch, category, type]);

  const handleOptionSelect = (questionIndex, optionIndex) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionIndex]: optionIndex,
    });
  };

  const handlePairSelect = (index) => {
    if (matchedPairs.includes(index)) return;
    
    setMatchedPairs([...matchedPairs, index]);
  };

  const handleSubmitGame = async () => {
    if (type === 'quiz' && Object.keys(selectedOptions).length !== games[currentGameIndex]?.questions?.length) {
      toast.warning('Please answer all questions before submitting');
      return;
    }
  
    try {
      let results;
      if (type === 'quiz') {
        const answers = games[currentGameIndex].questions.map((question, index) => ({
          questionId: question._id.toString(),
          selectedOption: selectedOptions[index]
        }));

        results = await submitGame({ 
          gameId: games[currentGameIndex]._id,
          gameType: 'quiz',
          answers 
        }).unwrap();
      } else if (type === 'match') {
        const totalPairs = games[currentGameIndex]?.pairs?.length || 0;
        results = await submitGame({
          gameId: games[currentGameIndex]._id,
          gameType: 'match',
          pairsMatched: matchedPairs.length,
          totalPairs
        }).unwrap();
      }

      setGameResults(results.data);
      setShowResults(true);
    } catch (err) {
      toast.error(err?.data?.error || err.error || 'Failed to submit game');
    }
  };

  const resetGame = () => {
    setCurrentGameIndex(0);
    setSelectedOptions({});
    setMatchedPairs([]);
    setShowResults(false);
    setGameResults(null);
    refetch();
  };

  if (isLoading) return <div className="loading-message">Loading game...</div>;
  if (error) return <div className="error-message">Error: {error.error || 'Failed to load game'}</div>;
  if (!games.length) return <div className="error-message">No games found for this category</div>;

  const currentGame = games[currentGameIndex];

  return (
    <div className="game-container">
      <div className="game-header">
        <h1 className="game-title">
          {category ? `${category.toUpperCase()} ${type.charAt(0).toUpperCase() + type.slice(1)} Game` : 'General Knowledge Game'}
        </h1>
        <div className="game-category-selector">
          <Link 
            to="/games" 
            className={!category ? 'active' : ''}
          >
            All Categories
          </Link>
          <Link 
            to="/games?category=rbi" 
            className={category === 'rbi' ? 'active' : ''}
          >
            RBI
          </Link>
          <Link 
            to="/games?category=sbi" 
            className={category === 'sbi' ? 'active' : ''}
          >
            SBI
          </Link>
          <Link 
            to="/games?category=ibps" 
            className={category === 'ibps' ? 'active' : ''}
          >
            IBPS
          </Link>
          <Link 
            to="/games?category=rrb" 
            className={category === 'rrb' ? 'active' : ''}
          >
            RRB
          </Link>
          <Link 
            to="/games?category=ssc" 
            className={category === 'ssc' ? 'active' : ''}
          >
            SSC
          </Link>
          <Link 
            to="/games?category=upsc" 
            className={category === 'upsc' ? 'active' : ''}
          >
            UPSC
          </Link>
        </div>
        <div className="game-type-selector">
          <Link 
            to={`/games${category ? `?category=${category}&type=quiz` : '?type=quiz'}`}
            className={type === 'quiz' ? 'active' : ''}
          >
            Quiz
          </Link>
          <Link 
            to={`/games${category ? `?category=${category}&type=match` : '?type=match'}`}
            className={type === 'match' ? 'active' : ''}
          >
            Match
          </Link>
          <Link 
            to={`/games${category ? `?category=${category}&type=memory` : '?type=memory'}`}
            className={type === 'memory' ? 'active' : ''}
          >
            Memory
          </Link>
        </div>
      </div>

      {!showResults ? (
        <div className="game-card">
          <div className="game-header">
            <h2>{currentGame.title}</h2>
            <div className="game-meta">
              <span className={`difficulty-badge ${currentGame.difficulty?.toLowerCase()}`}>
                {currentGame.difficulty}
              </span>
              <span className="game-category">
                {currentGame.category}
              </span>
            </div>
            <p className="game-description">{currentGame.description}</p>
          </div>

          {type === 'quiz' && (
            <div className="quiz-section">
              {currentGame.questions?.map((question, qIndex) => (
                <div key={qIndex} className="quiz-question">
                  <h3>Question {qIndex + 1}: {question.questionText}</h3>
                  <div className="quiz-options">
                    {question.options.map((option, oIndex) => (
                      <div
                        key={oIndex}
                        className={`quiz-option ${
                          selectedOptions[qIndex] === oIndex ? 'selected' : ''
                        }`}
                        onClick={() => handleOptionSelect(qIndex, oIndex)}
                      >
                        {option.optionText}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {type === 'match' && (
            <div className="match-section">
              <h3>Match the following:</h3>
              <div className="pairs-grid">
                {currentGame.pairs?.map((pair, index) => (
                  <div 
                    key={index} 
                    className={`pair-card ${matchedPairs.includes(index) ? 'matched' : ''}`}
                    onClick={() => handlePairSelect(index)}
                  >
                    {matchedPairs.includes(index) ? (
                      <>
                        <div className="term">{pair.term}</div>
                        <div className="definition">{pair.definition}</div>
                      </>
                    ) : (
                      <div className="placeholder">Click to reveal</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="game-footer">
            <div className="game-navigation">
              {currentGameIndex > 0 && (
                <button
                  onClick={() => setCurrentGameIndex(currentGameIndex - 1)}
                  className="btn btn-outline"
                >
                  Previous
                </button>
              )}
              {currentGameIndex < games.length - 1 ? (
                <button
                  onClick={() => setCurrentGameIndex(currentGameIndex + 1)}
                  className="btn"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmitGame}
                  disabled={isSubmitting}
                  className="btn btn-success"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Game'}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="results-card">
          <h2>Game Results</h2>
          {gameResults && (
            <>
              <div className="results-score">
                <div>{gameResults.score} / {gameResults.totalQuestions || gameResults.totalPairs}</div>
                <div>{gameResults.percentage}%</div>
              </div>

              {type === 'quiz' && (
                <div className="results-details">
                  {gameResults.results.map((result, index) => (
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
              )}

              {type === 'match' && (
                <div className="results-details">
                  <h3>You matched {gameResults.pairsMatched} out of {gameResults.totalPairs} pairs</h3>
                </div>
              )}
            </>
          )}

          <div className="results-actions">
            <button onClick={resetGame} className="btn">
              Play Again
            </button>
            <Link to={`/games${category ? `?category=${category}&type=${type}` : `?type=${type}`}`} className="btn btn-outline">
              New Game
            </Link>
          </div>
        </div>
      )}

      {previousResults.length > 0 && (
        <div className="previous-results">
          <h3>Your Previous Results</h3>
          <ul>
            {previousResults.map((result, index) => (
              <li key={index}>
                {result.game?.title || 'Game'} - {result.score}/{result.totalQuestions || result.totalPairs} ({result.percentage}%) -{' '}
                {new Date(result.createdAt).toLocaleDateString()}
                {result.game?.category && ` - ${result.game.category.toUpperCase()}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Game;