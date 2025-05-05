import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetNewsQuery } from '../slices/newsApiSlice';

const Home = () => {
  const { data: news, isLoading, error } = useGetNewsQuery();

  // return (
  //   <div className="home">
  //     {/* Hero Banner */}
  //     <div className="relative bg-blue-700 text-white py-20">
  //       <div className="container mx-auto px-4 text-center">
  //         <h1 className="text-4xl md:text-5xl font-bold mb-4">
  //           Ace Your Exams with MockTest Platform
  //         </h1>
  //         <p className="text-xl mb-8">
  //           Practice with our extensive test bank, study notes, and stay updated
  //           with current affairs.
  //         </p>
  //         <div className="flex justify-center space-x-4">
  //           <Link
  //             to="/register"
  //             className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
  //           >
  //             Get Started
  //           </Link>
  //           <Link
  //             to="/tests"
  //             className="bg-transparent border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700"
  //           >
  //             Browse Tests
  //           </Link>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Features Section */}
  //     <div className="py-16 bg-gray-50">
  //       <div className="container mx-auto px-4">
  //         <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
  //         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  //           <div className="bg-white p-6 rounded-lg shadow-md">
  //             <div className="text-blue-600 text-4xl mb-4">📝</div>
  //             <h3 className="text-xl font-semibold mb-2">Practice Tests</h3>
  //             <p className="text-gray-600">
  //               Access a wide range of practice tests to prepare for your exams.
  //             </p>
  //           </div>
  //           <div className="bg-white p-6 rounded-lg shadow-md">
  //             <div className="text-blue-600 text-4xl mb-4">🎮</div>
  //             <h3 className="text-xl font-semibold mb-2">Gamified Quizzes</h3>
  //             <p className="text-gray-600">
  //               Make learning fun with our interactive quiz game.
  //             </p>
  //           </div>
  //           <div className="bg-white p-6 rounded-lg shadow-md">
  //             <div className="text-blue-600 text-4xl mb-4">📚</div>
  //             <h3 className="text-xl font-semibold mb-2">Study Materials</h3>
  //             <p className="text-gray-600">
  //               Upload and access study notes to enhance your preparation.
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Latest News Section */}
  //     <div className="py-16">
  //       <div className="container mx-auto px-4">
  //         <h2 className="text-3xl font-bold text-center mb-12">Latest News</h2>
  //         {isLoading ? (
  //           <div className="text-center">Loading news...</div>
  //         ) : error ? (
  //           <div className="text-center text-red-500">
  //             Error loading news: {error.message}
  //           </div>
  //         ) : (
  //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //             {news?.slice(0, 3).map((item) => (
  //               <div
  //                 key={item._id}
  //                 className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
  //               >
  //                 <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
  //                 <p className="text-gray-600 mb-4">
  //                   {item.content.substring(0, 100)}...
  //                 </p>
  //                 <div className="flex justify-between items-center">
  //                   <span className="text-sm text-gray-500">{item.source}</span>
  //                   <Link
  //                     to={`/news`}
  //                     className="text-blue-600 hover:underline"
  //                   >
  //                     Read more
  //                   </Link>
  //                 </div>
  //               </div>
  //             ))}
  //           </div>
  //         )}
  //         <div className="text-center mt-8">
  //           <Link
  //             to="/news"
  //             className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
  //           >
  //             View All News
  //           </Link>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div>
      {/* Hero Banner */}
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

      {/* Features Section */}
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

      {/* Latest News Section */}
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