import { useEffect } from 'react';
import { useGetTestsQuery } from '../slices/testsApiSlice';
import { useGetNotesQuery } from '../slices/notesApiSlice';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const DashboardUser = () => {
  const { data: tests, isLoading: testsLoading } = useGetTestsQuery();
  const { data: notes, isLoading: notesLoading } = useGetNotesQuery();
  const { userInfo } = useSelector((state) => state.auth);

  // Filter notes only if userInfo is available
  const userNotes = notes?.filter(note => 
    note?.uploadedBy?._id === userInfo?._id
  ) || [];

  return (
    <div className="container">
      <h1 className="section-title">User Dashboard</h1>
      
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
                    {test.questions?.length || 0} questions • {test.duration || 30} mins
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2>Your Notes</h2>
            <Link to="/notes" className="card-link">
              View All
            </Link>
          </div>
          {notesLoading ? (
            <div>Loading notes...</div>
          ) : (
            <ul className="card-list">
              {userNotes.slice(0, 3).map((note) => (
                <li key={note._id}>
                  <Link to={`/notes/${note._id}`} className="card-link">
                    {note.title}
                  </Link>
                  <div className="card-meta">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </div>
                </li>
              ))}
              {userNotes.length === 0 && (
                <li className="empty-message">You haven't created any notes yet</li>
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="dashboard-card">
        <h2 className="card-title">Quick Actions</h2>
        <div className="action-grid">
          <Link to="/game" className="action-card bg-blue">
            Take a Quiz
          </Link>
          <Link to="/notes" className="action-card bg-green">
            Create Note
          </Link>
          <Link to="/tests" className="action-card bg-purple">
            Browse Tests
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardUser;