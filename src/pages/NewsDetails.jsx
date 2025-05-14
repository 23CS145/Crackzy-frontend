import { useParams } from 'react-router-dom';
import { useGetNewsItemQuery } from '../slices/newsApiSlice';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const NewsDetails = () => {
  const { id } = useParams();
  const { data: newsItem, isLoading, error } = useGetNewsItemQuery(id);
  const { userInfo } = useSelector((state) => state.auth);

  if (isLoading) return <div>Loading news...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container">
      <div className="news-detail-card">
        <div className="news-header">
          <h1>{newsItem.title}</h1>
          <div className="news-meta">
            <span>Source: {newsItem.source}</span>
            <span>
              {new Date(newsItem.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            {newsItem.isImportant && (
              <span className="important-badge">Important</span>
            )}
          </div>
        </div>
        
        <div className="news-content">
          {newsItem.content.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="news-actions">
          <Link to="/news" className="btn btn-outline">
            Back to News
          </Link>
          {userInfo?.role === 'admin' && (
            <Link 
              to={`/news/edit/${newsItem._id}`} 
              className="btn"
            >
              Edit News
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;