import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../store/authSlice';
import { Mail, Lock, User, ArrowRight, AlertCircle, ShieldCheck, Loader2, Eye, EyeOff } from 'lucide-react';
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
  const [validationError, setValidationError] = useState('');
  
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
    if (validationError) setValidationError('');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match. Please ensure both passwords match exactly.');
      return;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }
    dispatch(register({ name, email, password }));
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

          <span className="badge badge-primary">Workspace Provisioning</span>
          <h1>Initialize Profile</h1>
          <p className="text-secondary">Create your corporate profile to initiate communication intelligence.</p>
        </header>

        {(isError || validationError) && (
          <div className="auth-error-block">
            <AlertCircle size={15} />
            <span>{validationError || message}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={onSubmit}>
          <div className="field-group">
            <label className="field-label">Full Name</label>
            <div className="input-with-icon">
              <User size={15} className="input-icon" />
              <input
                type="text"
                name="name"
                className="input"
                value={name}
                onChange={onChange}
                placeholder="Sarah Jenkins"
                required
              />
            </div>
          </div>

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
            <label className="field-label">Password</label>
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

          <div className="field-group">
            <label className="field-label">Confirm Password</label>
            <div className="input-with-icon">
              <Lock size={15} className="input-icon" />
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
                className="password-toggle-btn"
                onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                aria-label="Toggle password visibility"
              >
                {showVerifyPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary full-width btn-lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Provisioning Account...</span>
              </>
            ) : (
              <>
                <span>Complete Account Setup</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <footer className="auth-footer text-center">
          <p className="text-secondary">
            Already provisioned? <Link to="/login" className="auth-link">Sign in</Link>
          </p>

          <div className="auth-security-notice">
            <ShieldCheck size={12} className="text-success" />
            <span>Zero Data Retention Policy · AES-256 Storage</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default RegisterPage;
