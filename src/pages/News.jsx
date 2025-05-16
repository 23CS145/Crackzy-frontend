import { useEffect } from 'react';
import { useGetNewsQuery, useGetNewsCategoriesQuery } from '../slices/newsApiSlice';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import CategorySelector from '../components/CategorySelector';

const News = () => {
  const { category } = useParams();
  const { data: news, isLoading, error, refetch } = useGetNewsQuery({ category });
  const { data: categories } = useGetNewsCategoriesQuery();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    refetch();
  }, [refetch, category]);

  return (
    <div className="container">
      <div className="page-header">
        <h1>
          {category ? `${category.toUpperCase()} News` : 'Current Affairs & News'}
        </h1>
        {userInfo?.role === 'admin' && (
          <Link to="/admin/dashboard" className="btn">
            Add News
          </Link>
        )}
      </div>

      {categories && (
        <CategorySelector 
          categories={categories} 
          basePath="/news" 
          currentCategory={category}
        />
      )}

      {isLoading ? (
        <div className="loading-message">Loading news...</div>
      ) : error ? (
        <div className="error-message">Error: {error.message}</div>
      ) : (
        <div className="news-list">
          {news?.length > 0 ? (
            news.map((item) => (
              <div
                key={item._id}
                className={`news-card ${item.isImportant ? 'important' : ''}`}
              >
                <div className="news-content">
                  <div className="news-header">
                    <div>
                      <h2>{item.title}</h2>
                      <div className="news-category">
                        {item.category}
                        {item.isImportant && (
                          <span className="important-badge">Important</span>
                        )}
                      </div>
                    </div>
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
                <div className="news-actions">
                  <Link to={`/news/${item._id}`} className="btn btn-outline">
                    Read More
                  </Link>
                  {userInfo?.role === 'admin' && (
                    <>
                      <Link 
                        to={`/news/edit/${item._id}`} 
                        className="btn"
                      >
                        Edit
                      </Link>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-message">
              No news found for this category
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default News;