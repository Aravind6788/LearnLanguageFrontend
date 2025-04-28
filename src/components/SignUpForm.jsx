import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/SignUpForm.css"; // We'll create this CSS file next

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      navigate("/login");
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Create an account</h2>
          <p className="form-subtitle">Start your language learning journey today!</p>
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select 
              id="role"
              name="role" 
              value={formData.role} 
              onChange={handleChange}
              required
            >
              <option value="" disabled>--Select Role--</option>
              <option value="learner">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <button type="submit" className="primary-button">Sign Up</button>
          
          {message && <p className="message error-message">{message}</p>}
          
          <div className="auth-redirect">
            <p>Already have an account?</p>
            <Link to="/login" className="redirect-link">Log In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;