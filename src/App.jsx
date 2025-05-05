import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Tests from './pages/Tests';
import Game from './pages/Game';
import Notes from './pages/Notes';
import News from './pages/News';
import DashboardUser from './pages/DashboardUser';
import DashboardAdmin from './pages/DashboardAdmin';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import TestDetails from './pages/TestDetails';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <ToastContainer />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/tests" element={<Tests />} />
              <Route path="/tests/:id" element={<TestDetails />} />
              <Route path="/game" element={<PrivateRoute />}>
                <Route path="/game" element={<Game />} />
              </Route>
              <Route path="/notes" element={<PrivateRoute />}>
                <Route path="/notes" element={<Notes />} />
              </Route>
              <Route path="/news" element={<News />} />
              <Route path="/dashboard" element={<PrivateRoute />}>
                <Route path="/dashboard" element={<DashboardUser />} />
              </Route>
              <Route path="/admin/dashboard" element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<DashboardAdmin />} />
              </Route>
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;