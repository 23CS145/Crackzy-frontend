import { useEffect } from 'react';
import { useGetNewsQuery } from '../slices/newsApiSlice';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const News = () => {
  const { data: news, isLoading, error, refetch } = useGetNewsQuery();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="container">
      <div className="page-header">
        <h1>Current Affairs & News</h1>
        {userInfo?.role === 'admin' && (
          <Link to="/admin/dashboard" className="btn">
            Add News
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="loading-message">Loading news...</div>
      ) : error ? (
        <div className="error-message">Error: {error.message}</div>
      ) : (
        <div className="news-list">
          {news?.map((item) => (
            <div
              key={item._id}
              className={`news-card ${item.isImportant ? 'important' : ''}`}
            >
              <div className="news-content">
                <div className="news-header">
                  <h2>{item.title}</h2>
                  {item.isImportant && (
                    <span className="important-badge">Important</span>
                  )}
                </div>
                <p className="news-text">{item.content}</p>
                <div className="news-meta">
                  <span>Source: {item.source}</span>
                  <span>
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;