// fe/src/components/auth/LoginForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import './LoginForm.scss';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (user.role.startsWith('platform')) {
        navigate('/platform/dashboard', { replace: true });
      } else if (user.role.startsWith('tenant')) {
        navigate('/tenant/dashboard', { replace: true });
      }
    }
  }, [loading, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
    } catch (error: any) {
      console.error('Login failed:', error);
      setLoginError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="loginFormContainer">
      <div className="loginFormCard">
        <h1 className="loginFormHeading">Login</h1>
        <form onSubmit={handleSubmit} className="loginFormForm">
          {loginError && <div className="error-message">{loginError}</div>}
          <div className="formGroup">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="formGroup password-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span 
                onClick={togglePasswordVisibility} 
                className="password-toggle-icon"
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || loading}
            className="loginFormButton"
          >
            {(isLoading || loading) ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;