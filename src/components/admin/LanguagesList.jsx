import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/LanguagesList.css"; // Using the same admin CSS file

const LanguagesList = () => {
    const handleLogout = () => {
        // Clear user session or token (assuming you're using localStorage or cookies)
        localStorage.removeItem('token');  // or sessionStorage.clear() if using sessionStorage
        
        // Redirect to login page
        navigate('/login');  // Replace '/login' with the route of your login page
      };
  const [languages, setLanguages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    // Protect page: Only allow Admins
    if (!token || role !== "admin") {
      navigate("/login");
      return;
    }

    const fetchLanguages = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://learnlanguage-9gzy.onrender.com/api/languages", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLanguages(res.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load languages");
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, [token, role, navigate]);

  const handleCreateNew = () => {
    navigate("/admin/create-language");
  };

  const handleViewLessons = (languageId) => {
    navigate(`/admin/languages/${languageId}/lessons`);
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
          <h2>Language Management</h2>
          <button className="primary-button" onClick={handleCreateNew}>
            <span>➕ Add New Language</span>
          </button>
        </div>

        {error && <div className="message error-message">{error}</div>}
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading languages...</p>
          </div>
        ) : (
          <div className="grid-container">
            {languages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🌎</div>
                <h3>No languages found</h3>
                <p>Start by adding a new language to your platform.</p>
                <button className="primary-button" onClick={handleCreateNew}>
                  Add Your First Language
                </button>
              </div>
            ) : (
              <div className="card-grid">
                {languages.map((lang) => (
                  <div className="list-card" key={lang._id}>
                    <div className="card-header">
                      <div className="card-icon">🌐</div>
                      <h3 className="card-title">{lang.name}</h3>
                    </div>
                    <div className="card-content">
                      <div className="info-item">
                        <span className="info-label">Language Code:</span>
                        <span className="info-value">{lang.code}</span>
                      </div>
                    </div>
                    <div className="card-actions">
                      <button 
                        className="secondary-button" 
                        onClick={() => handleViewLessons(lang._id)}
                      >
                        📚 View Lessons
                      </button>
                      {/* <button 
                        className="icon-button" 
                        onClick={() => navigate(`/admin/edit-language/${lang._id}`)}
                        title="Edit Language"
                      >
                        ✏️
                      </button> */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguagesList;