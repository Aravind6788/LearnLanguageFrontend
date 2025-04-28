import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../styles/LanguageForm.css"; // New shared CSS file for admin forms

const LanguageForm = () => {
    const handleLogout = () => {
        // Clear user session or token (assuming you're using localStorage or cookies)
        localStorage.removeItem('token');  // or sessionStorage.clear() if using sessionStorage
        
        // Redirect to login page
        navigate('/login');  // Replace '/login' with the route of your login page
      };
  const [formData, setFormData] = useState({
    name: "",
    code: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    // Protect page: Only allow Admins
    if (!token || role !== "admin") {
      navigate("/login");
    }
  }, [token, role, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/languages",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Language created successfully!");
      setFormData({ name: "", code: "" });

      setTimeout(() => {
        navigate("/admin/languages");
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create language.");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h3 className="admin-logo">Admin Dashboard</h3>
        <nav className="admin-nav">
          <Link to="/admin/dashboard" className="nav-item">
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/languages" className="nav-item active">
            <span className="nav-icon">🌎</span>
            <span>Languages</span>
          </Link>
           {/* <Link to="/admin/lessons" className="nav-item">
            <span className="nav-icon">📚</span>
            <span>Lessons</span>
          </Link> */}
          <Link to="/admin/users" className="nav-item">
            <span className="nav-icon">👥</span>
            <span>Users</span>
          </Link>
        </nav>
        <div className="logout-section">
    <button className="logout-button" onClick={handleLogout}>
      🚪 Logout
    </button>
  </div>
      </div>
      
      <div className="admin-content">
        <div className="content-header">
          <h2>Create New Language</h2>
          <Link to="/admin/languages" className="secondary-button">
            Back to Languages
          </Link>
        </div>
        
        <div className="form-card">
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label htmlFor="name">Language Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="e.g., English, Spanish, Japanese"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="code">Language Code</label>
              <input
                type="text"
                id="code"
                name="code"
                placeholder="e.g., en, es, ja"
                value={formData.code}
                onChange={handleChange}
                required
              />
              <small className="form-help">2-letter ISO language code (e.g., en for English)</small>
            </div>

            <button type="submit" className="primary-button">
              Create Language
            </button>

            {message && (
              <p className={`message ${message.includes("successfully") ? "success-message" : "error-message"}`}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LanguageForm;