import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../store/authSlice';
import { Mail, Lock, User, ArrowRight, AlertCircle, Sparkles, Loader2, Eye, EyeOff } from 'lucide-react';
import './Auth.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { name, email, password, confirmPassword } = formData;
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
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
    if (password !== confirmPassword) {
      alert('Passwords do not match');
    } else {
      dispatch(register({ name, email, password }));
    }
  };

  return (
    <div className="auth-page container">
      <div className="auth-card-centered">
        <header className="auth-header text-center">
          <span className="badge"><Sparkles size={12} /> New Identity</span>
          <h1>Initialize Profile</h1>
          <p className="text-secondary">Create your professional credentials for AI-driven communications training.</p>
        </header>

        {isError && (
          <div className="auth-error-block">
            <AlertCircle size={14} />
            <span>{message}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={onSubmit}>
          <div className="field-group">
            <label>Full Name</label>
            <div className="input-with-icon">
              <User size={16} />
              <input
                type="text"
                name="name"
                className="input"
                value={name}
                onChange={onChange}
                placeholder="Eleanor Shellstrop"
                required
              />
            </div>
          </div>

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

          <div className="field-group">
            <label>Verify Password</label>
            <div className="input-with-icon">
              <Lock size={16} />
              <input
                type={showVerifyPassword ? 'text' : 'password'}
                name="confirmPassword"
                className="input"
                value={confirmPassword}
                onChange={onChange}
                placeholder="••••••••"
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                aria-label="Toggle password visibility"
              >
                {showVerifyPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary full-width btn-lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Provisioning...
              </>
            ) : (
              <>
                Create Account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <footer className="auth-footer text-center">
          <p className="text-secondary">Existing operator? <Link to="/login" className="text-primary">Sign In</Link></p>
        </footer>
      </div>
    </div>
  );
};

export default RegisterPage;
