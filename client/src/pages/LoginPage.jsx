import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../store/authSlice';
import { Mail, Lock, Loader2, ArrowRight, AlertCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import './Auth.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess || user) {
      navigate('/dashboard');
    }
    dispatch(reset());
  }, [user, isSuccess, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="auth-page container">
      <div className="auth-card-centered card card-elevated">
        <header className="auth-header text-center">
          <div className="auth-brand-row">
            <div className="auth-icon-wrap">
              <ShieldCheck size={18} />
            </div>
            <span className="auth-brand-name">Ethos Enterprise</span>
          </div>

          <span className="badge badge-primary">Enterprise Portal</span>
          <h1>Sign In to Workspace</h1>
          <p className="text-secondary">Enter your corporate credentials to access communications intelligence.</p>
        </header>

        {isError && (
          <div className="auth-error-block">
            <AlertCircle size={15} />
            <span>{message || 'Invalid credentials. Please verify your email and password.'}</span>
          </div>
        )}

        <div className="demo-credentials-card">
          <div className="demo-credentials-info">
            <span className="demo-badge">Demo Account</span>
            <span className="demo-label">Pre-configured test workspace</span>
          </div>
          <button 
            type="button" 
            className="btn btn-outline btn-sm demo-fill-btn"
            onClick={() => setFormData({ email: 'admin@ethos.ai', password: 'password123' })}
          >
            Quick Fill
          </button>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <div className="field-group">
            <label className="field-label">Corporate Email</label>
            <div className="input-with-icon">
              <Mail size={15} className="input-icon" />
              <input
                type="email"
                name="email"
                className="input"
                value={email}
                onChange={onChange}
                placeholder="name@company.com"
                required
              />
            </div>
          </div>

          <div className="field-group">
            <div className="label-row">
              <label className="field-label">Password</label>
            </div>
            <div className="input-with-icon">
              <Lock size={15} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="input"
                value={password}
                onChange={onChange}
                placeholder="••••••••"
                required
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary full-width btn-lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Access Workspace</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <footer className="auth-footer text-center">
          <p className="text-secondary">
            Need an enterprise account? <Link to="/register" className="auth-link">Initialize profile</Link>
          </p>

          <div className="auth-security-notice">
            <ShieldCheck size={12} className="text-success" />
            <span>256-Bit Encrypted Session · SOC-2 Type II Certified</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
