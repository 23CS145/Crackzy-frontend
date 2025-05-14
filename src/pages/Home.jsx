import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetNewsQuery } from '../slices/newsApiSlice';

const Home = () => {
  const { data: news, isLoading, error } = useGetNewsQuery();

  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>Ace Your Exams with MockTest Platform</h1>
          <p>
            Practice with our extensive test bank, study notes, and stay updated
            with current affairs.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn">
              Get Started
            </Link>
            <Link to="/tests" className="btn btn-outline">
              Browse Tests
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="section-title">
            <h2>Features</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Practice Tests</h3>
              <p>
                Access a wide range of practice tests to prepare for your exams.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎮</div>
              <h3>Gamified Quizzes</h3>
              <p>Make learning fun with our interactive quiz game.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Study Materials</h3>
              <p>
                Upload and access study notes to enhance your preparation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '4rem 0' }}>
        <div className="section-title">
          <h2>Latest News</h2>
        </div>
        {isLoading ? (
          <div className="text-center">Loading news...</div>
        ) : error ? (
          <div className="text-center" style={{ color: 'var(--danger-color)' }}>
            Error loading news: {error.message}
          </div>
        ) : (
          <div className="features-grid">
            {news?.slice(0, 3).map((item) => (
              <div key={item._id} className="feature-card">
                <h3>{item.title}</h3>
                <p>{item.content.substring(0, 100)}...</p>
                <div className="test-meta">
                  <span>{item.source}</span>
                  <Link to="/news">Read more</Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-center" style={{ marginTop: '2rem' }}>
          <Link to="/news" className="btn">
            View All News
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;