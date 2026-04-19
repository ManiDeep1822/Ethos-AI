import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../store/authSlice';
import { Mail, Lock, Loader2, ArrowRight, AlertCircle, Sparkles, Eye, EyeOff } from 'lucide-react';
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
      <div className="auth-card-centered">
        <header className="auth-header text-center">
          <span className="badge"><Sparkles size={12} /> Secure Portal</span>
          <h1>Welcome Back</h1>
          <p className="text-secondary">Sign in to your professional workstation to continue training.</p>
        </header>

        {isError && (
          <div className="auth-error-block">
            <AlertCircle size={14} />
            <span>{message}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={onSubmit}>
          <div className="field-group">
            <label>Email</label>
            <div className="input-with-icon">
              <Mail size={16} />
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
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={16} />
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
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary full-width btn-lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Verifying...
              </>
            ) : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <footer className="auth-footer text-center">
          <p className="text-secondary">New user? <Link to="/register" className="text-primary">Sign up</Link></p>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
