import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/SignUpForm.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      const { token, user } = response.data;
      
      // Make sure we store userId in the correct format
      if (user) {
        // First, store the whole user object
        localStorage.setItem('user', JSON.stringify(user));
        
        // Then store individual fields
        if (user.id) {
          localStorage.setItem('userId', user.id);
          console.log("Stored userId (id):", user.id);
        } else if (user._id) {
          localStorage.setItem('userId', user._id);
          console.log("Stored userId (_id):", user._id);
        }
        
        if (user.role) {
          localStorage.setItem('role', user.role);
        }
        
        if (user.username) {
          localStorage.setItem('username', user.username);
        }
      }
      
      // Store token
      localStorage.setItem('token', token);
      
      // Log the stored values for debugging
      console.log("Stored user data:", {
        token: token ? 'Present' : 'Missing',
        userId: localStorage.getItem('userId'),
        role: localStorage.getItem('role'),
        username: localStorage.getItem('username')
      });
      
      setLoading(false);
      
      // Redirect based on role
      const role = user?.role || '';
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'learner') {
        navigate('/learner/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.msg || 'Login failed. Please try again.');
      console.error("Login error:", err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Login to Your Account</h2>
          <p>Welcome back! Please enter your credentials to continue.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* <div className="form-footer">
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div> */}

          <button type="submit" className="submit-button primary-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-redirect">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 