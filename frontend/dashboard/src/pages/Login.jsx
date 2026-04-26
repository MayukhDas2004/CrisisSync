import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import '../styles/Login.css';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await API.post(
        '/auth/login',
        new URLSearchParams({
          username: email,
          password: password
        })
      );

      const token = response.data.access_token;

      localStorage.setItem('token', token);
      localStorage.setItem('username', email);

      // ROLE REDIRECT LOGIC
      if (email.includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/staff');
      }

    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        {/* Logo */}
        <div className="login-logo">
          <h1>Crisis<span>Sync</span></h1>
          <p>Hotel Emergency Management System</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="login-form">

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? '⏳ Logging in...' : '🔐 Login'}
          </button>

        </form>

        {/* 🔥 NEW: Signup Link */}
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <p>
            Don’t have an account?{' '}
            <span
              onClick={() => navigate('/signup')}
              style={{
                color: '#007bff',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Sign up
            </span>
          </p>
        </div>

        <div className="login-footer">
          <p>CrisisSync © 2026 — Emergency Response System</p>
        </div>

      </div>
    </div>
  );
}

export default Login;
