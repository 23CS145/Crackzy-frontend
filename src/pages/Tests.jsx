import { useEffect, useState } from 'react';
import { useGetTestsQuery } from '../slices/testsApiSlice';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import CategorySelector from '../components/CategorySelector';
import CategoryCard from '../components/CategoryCard';

const Tests = () => {
  const { category } = useParams();
  const { data: tests, isLoading, error, refetch } = useGetTestsQuery();
  const { userInfo } = useSelector((state) => state.auth);
  
  const [categories, setCategories] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  useEffect(() => {
    refetch();
    if (tests) {
      const uniqueCategories = [...new Set(tests.map(test => test.category))];
      setCategories(uniqueCategories);
    }
  }, [refetch, tests]);

  const filteredTests = tests?.filter(test => {
    const matchesCategory = !category || test.category.toLowerCase() === category.toLowerCase();
    const matchesDifficulty = difficultyFilter === 'all' || test.difficulty === difficultyFilter;
    return matchesCategory && matchesDifficulty;
  });

  const getTestCountByCategory = (cat) => {
    return tests?.filter(test => test.category === cat).length || 0;
  };

  const getTestCountByDifficulty = (diff) => {
    if (category) {
      return tests?.filter(test => 
        test.difficulty === diff && 
        test.category.toLowerCase() === category.toLowerCase()
      ).length || 0;
    }
    return tests?.filter(test => test.difficulty === diff).length || 0;
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>
          {category ? `${category.toUpperCase()} Tests` : 'All Tests'}
          {difficultyFilter !== 'all' && ` (${difficultyFilter})`}
        </h1>
        {userInfo?.role === 'admin' && (
          <Link to="/admin/dashboard" className="btn">
            Create New Test
          </Link>
        )}
      </div>

      {!category && (
        <div className="categories-grid">
          {categories.map((cat) => (
            <CategoryCard 
              key={cat}
              category={cat}
              count={getTestCountByCategory(cat)}
            />
          ))}
        </div>
      )}

      <CategorySelector 
        categories={categories} 
        basePath="/tests" 
        currentCategory={category}
      />

      <div className="difficulty-filter">
        <button 
          onClick={() => setDifficultyFilter('all')} 
          className={difficultyFilter === 'all' ? 'active' : ''}
        >
          All ({tests?.length || 0})
        </button>
        <button 
          onClick={() => setDifficultyFilter('Easy')} 
          className={difficultyFilter === 'Easy' ? 'active' : ''}
        >
          Easy ({getTestCountByDifficulty('Easy')})
        </button>
        <button 
          onClick={() => setDifficultyFilter('Medium')} 
          className={difficultyFilter === 'Medium' ? 'active' : ''}
        >
          Medium ({getTestCountByDifficulty('Medium')})
        </button>
        <button 
          onClick={() => setDifficultyFilter('Hard')} 
          className={difficultyFilter === 'Hard' ? 'active' : ''}
        >
          Hard ({getTestCountByDifficulty('Hard')})
        </button>
      </div>

      {isLoading ? (
        <div className="loading-message">Loading tests...</div>
      ) : error ? (
        <div className="error-message">Error loading tests: {error.message}</div>
      ) : (
        <div className="tests-grid">
          {filteredTests?.length > 0 ? (
            filteredTests.map((test) => (
              <div key={test._id} className="test-card">
                <div className="test-content">
                  <div className="test-meta-header">
                    <span className="test-category">
                      {test.category}
                    </span>
                    <span className={`difficulty-badge ${test.difficulty?.toLowerCase()}`}>
                      {test.difficulty}
                    </span>
                  </div>
                  <h2>{test.title}</h2>
                  <p className="test-description">{test.description}</p>
                  <div className="test-meta">
                    <span>{test.questions.length} questions</span>
                    <span>{test.duration} mins</span>
                  </div>
                </div>
                <div className="test-footer">
                  <Link to={`/tests/${test._id}`} className="btn btn-outline">
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-message">
              No tests found matching your criteria
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tests;