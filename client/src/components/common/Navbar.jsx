import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../../store/authSlice';
import { LogOut, Sparkles, LayoutDashboard, ScanText, MessageSquare } from 'lucide-react';
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
        {/* Logo */}
        <Link to="/" className="logo">
          <Sparkles size={18} className="primary-icon" />
          <span className="logo-text">Ethos</span>
        </Link>

        {user ? (
          <>
            {/* Center Nav Links */}
            <ul className="nav-links">
              <li>
                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                  <LayoutDashboard size={14} />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/analyze" className={`nav-link ${isActive('/analyze') ? 'active' : ''}`}>
                  <ScanText size={14} />
                  Analyzer
                </Link>
              </li>
              <li>
                <Link to="/chat" className={`nav-link ${isActive('/chat') ? 'active' : ''}`}>
                  <MessageSquare size={14} />
                  Training
                </Link>
              </li>
            </ul>

            {/* Right Actions */}
            <div className="nav-actions">
              {/* User Avatar */}
              <div className="nav-avatar">
                <span>{(user.name || 'U').charAt(0).toUpperCase()}</span>
              </div>
              <span className="user-name">{user.name}</span>

              {/* Logout — unchanged */}
              <button className="btn-logout" onClick={onLogout}>
                <span>Logout</span>
                <LogOut size={14} />
              </button>
            </div>
          </>
        ) : (
          <div className="nav-auth">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
