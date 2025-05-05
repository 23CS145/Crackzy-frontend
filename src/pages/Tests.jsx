import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetTestsQuery } from '../slices/testsApiSlice';
import { useSelector } from 'react-redux';

const Tests = () => {
  const { data: tests, isLoading, error, refetch } = useGetTestsQuery();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="container">
      <div className="page-header">
        <h1>Available Tests</h1>
        {userInfo?.role === 'admin' && (
          <Link to="/admin/dashboard" className="btn">
            Create New Test
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="loading-message">Loading tests...</div>
      ) : error ? (
        <div className="error-message">Error loading tests: {error.message}</div>
      ) : (
        <div className="tests-grid">
          {tests?.map((test) => (
            <div key={test._id} className="test-card">
              <div className="test-content">
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
          ))}
        </div>
      )}
    </div>
  );
};

export default Tests;