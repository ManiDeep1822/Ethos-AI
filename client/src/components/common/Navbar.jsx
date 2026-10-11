import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../../store/authSlice';
import { LogOut, ShieldCheck, LayoutDashboard, FileSearch, MessageSquareQuote } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container nav-content">
        {/* Enterprise Brand Logo */}
        <Link to="/" className="logo">
          <div className="logo-icon-wrap">
            <ShieldCheck size={18} className="logo-icon" />
          </div>
          <span className="logo-text">Ethos</span>
          <span className="logo-badge">Enterprise</span>
        </Link>

        {user ? (
          <>
            {/* Center Navigation */}
            <ul className="nav-links">
              <li>
                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                  <LayoutDashboard size={15} />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/analyze" className={`nav-link ${isActive('/analyze') ? 'active' : ''}`}>
                  <FileSearch size={15} />
                  <span>Text Intelligence</span>
                </Link>
              </li>
              <li>
                <Link to="/chat" className={`nav-link ${isActive('/chat') ? 'active' : ''}`}>
                  <MessageSquareQuote size={15} />
                  <span>Simulation Arena</span>
                </Link>
              </li>
            </ul>

            {/* Right Actions & Profile */}
            <div className="nav-actions">
              <span className="workspace-pill">Enterprise Workspace</span>

              <div className="user-profile-badge">
                <div className="nav-avatar">
                  <span>{(user.name || 'U').charAt(0).toUpperCase()}</span>
                </div>
                <span className="user-name">{user.name}</span>
              </div>

              <button className="btn-logout" onClick={onLogout} title="Sign Out">
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </>
        ) : (
          <div className="nav-auth">
            <Link to="/login" className="nav-link">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
