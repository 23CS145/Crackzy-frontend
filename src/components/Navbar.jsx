import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/authSlice';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <header>
      <div className="container navbar">
        <Link to="/" className="logo">
          Crackzy
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/tests">Tests</Link>
          {userInfo && <Link to="/games">Games</Link>}
          {userInfo && <Link to="/notes">Notes</Link>}
          <Link to="/news">News</Link>
          {userInfo?.role === 'admin' && (
            <>
              <Link to="/admin/dashboard">Admin Dashboard</Link>
              <Link to="/admin/users">User Management</Link>
            </>
          )}
          {userInfo && <Link to="/dashboard">My Dashboard</Link>}
        </nav>

        <div className="auth-buttons">
          {userInfo ? (
            <>
              <span className="welcome-text">Welcome, {userInfo.name}</span>
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;