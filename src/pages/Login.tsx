import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string, rememberMe: boolean) => Promise<unknown>;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await onLogin(email, password, rememberMe);
      navigate('/alumni');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-branding">
            <img src="/icons/logo.png" alt="ACC Alumni logo" className="login-logo-img" width={180} height={180} />
            <h1 className="login-system-name">ACC Alumni</h1>
            <p className="login-system-tagline">University Alumni Tracking System</p>
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-wrapper">
            <h2>Sign In</h2>
            <p className="login-subtitle">Welcome back! Please enter your credentials.</p>

            {error && (
              <div className="login-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} />
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <Lock size={18} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="login-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-password" onClick={(e) => e.preventDefault()}>
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? (
                  <span className="loading-btn">
                    <span className="btn-spinner" aria-hidden="true"></span>
                    Login
                  </span>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            <div className="login-demo-info">
              <p>Demo Accounts</p>
              <div className="demo-account demo-account-alumni">
                <div className="demo-account-detail">
                  <strong>Alumni (mobile app)</strong>
                  <code>alumni@example.com / alumni123</code>
                </div>
                <button
                  type="button"
                  className="btn btn-sm demo-use-btn"
                  onClick={() => {
                    setEmail('alumni@example.com');
                    setPassword('alumni123');
                  }}
                >
                  Use
                </button>
              </div>
              <div className="demo-account">
                <div className="demo-account-detail">
                  <strong>Admin (dashboard)</strong>
                  <code>admin@example.com / admin123</code>
                </div>
                <button
                  type="button"
                  className="btn btn-sm demo-use-btn"
                  onClick={() => {
                    setEmail('admin@example.com');
                    setPassword('admin123');
                  }}
                >
                  Use
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;