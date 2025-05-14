import { useEffect } from 'react';
import { useGetTestsQuery } from '../slices/testsApiSlice';
import { useGetNotesQuery } from '../slices/notesApiSlice';
import { useGetNewsQuery } from '../slices/newsApiSlice';
import { useGetUsersQuery } from '../slices/usersApiSlice';
import { Link } from 'react-router-dom';

const DashboardAdmin = () => {
  const { data: tests, isLoading: testsLoading } = useGetTestsQuery();
  const { data: notes, isLoading: notesLoading } = useGetNotesQuery();
  const { data: news, isLoading: newsLoading } = useGetNewsQuery();
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();

  return (
    <div className="container">
      <h1 className="section-title">Admin Dashboard</h1>
      
      <div className="dashboard-grid">
        <div className="dashboard-card bg-blue">
          <h3>Total Tests</h3>
          <p>{testsLoading ? '...' : tests?.length || 0}</p>
        </div>
        <div className="dashboard-card bg-green">
          <h3>Total Notes</h3>
          <p>{notesLoading ? '...' : notes?.length || 0}</p>
        </div>
        <div className="dashboard-card bg-purple">
          <h3>News Items</h3>
          <p>{newsLoading ? '...' : news?.length || 0}</p>
        </div>
        <div className="dashboard-card bg-yellow">
          <h3>Registered Users</h3>
          <p>{usersLoading ? '...' : users?.length || 0}</p>
        </div>
      </div>

      <div className="dashboard-columns">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Recent Tests</h2>
            <Link to="/tests" className="card-link">
              View All
            </Link>
          </div>
          {testsLoading ? (
            <div>Loading tests...</div>
          ) : (
            <ul className="card-list">
              {tests?.slice(0, 3).map((test) => (
                <li key={test._id}>
                  <Link to={`/tests/${test._id}`} className="card-link">
                    {test.title}
                  </Link>
                  <div className="card-meta">
                    Created by: {test?.createdBy?.name || 'Unknown'}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2>Recent News</h2>
            <Link to="/news" className="card-link">
              View All
            </Link>
          </div>
          {newsLoading ? (
            <div>Loading news...</div>
          ) : (
            <ul className="card-list">
              {news?.slice(0, 3).map((item) => (
                <li key={item._id}>
                  <Link to="/news" className="card-link">
                    {item.title}
                  </Link>
                  <div className="card-meta">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="dashboard-card">
        <h2 className="card-title">Admin Actions</h2>
        <div className="action-grid">
          <Link to="/tests" className="action-card bg-blue">
            Manage Tests
          </Link>
          <Link to="/notes" className="action-card bg-green">
            Manage Notes
          </Link>
          <Link to="/news" className="action-card bg-purple">
            Manage News
          </Link>
          <Link to="/admin/users" className="action-card bg-yellow">
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;