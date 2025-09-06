import React, { useState } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import './LoginForm.scss'; 

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[LoginForm] Form submitted. Attempting login...');
    await login(email, password, () => {
      console.log('[LoginForm] Login successful, navigating to dashboard.');
      navigate('/');
    });
  };

  return (
    <div className="loginFormContainer">
      <div className="loginFormCard">
        <h1 className="loginFormHeading">Login</h1>
        <form onSubmit={handleSubmit} className="loginFormForm">
          {error && <div className="error-message">{error}</div>}
          <div className="formGroup">
            <label htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="formGroup">
            <label htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="loginFormButton"
            onClick={() => console.log('Button Clicked!')} // Simple, direct test
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
