import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../styles/LanguagesLesson.css"; // Using our shared admin CSS file

const LanguageLessons = () => {
    const handleLogout = () => {
        // Clear user session or token (assuming you're using localStorage or cookies)
        localStorage.removeItem('token');  // or sessionStorage.clear() if using sessionStorage
        
        // Redirect to login page
        navigate('/login');  // Replace '/login' with the route of your login page
      };
  const { id } = useParams(); // Get the language ID from URL
  const [lessons, setLessons] = useState([]);
  const [language, setLanguage] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    // Protect page: Only allow Admins
    if (!token || role !== "admin") {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // First, fetch language info to display the language name
        // const languageRes = await axios.get(`https://learnlanguage-9gzy.onrender.com/api/languages/${id}`, {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // setLanguage(languageRes.data);

        // Then fetch lessons for this language
        const lessonsRes = await axios.get(`https://learnlanguage-9gzy.onrender.com/api/languages/${id}/lessons`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLessons(lessonsRes.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load lessons");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token, role, navigate]);

  const handleCreateLesson = () => {
    navigate(`/admin/languages/${id}/create-lesson`);
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
          <div className="breadcrumb">
            <Link to="/admin/languages" className="breadcrumb-link">Languages</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{language.name || 'Lessons'}</span>
          </div>
          <button className="primary-button" onClick={handleCreateLesson}>
            <span>➕ Add New Lesson</span>
          </button>
        </div>

        <div className="subheader">
          <h2>Lessons for {language.name || 'Language'}</h2>
          <div className="language-badge">
            {language.code && <span>{language.code.toUpperCase()}</span>}
          </div>
        </div>

        {error && <div className="message error-message">{error}</div>}
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading lessons...</p>
          </div>
        ) : (
          <div className="grid-container">
            {lessons.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No lessons found</h3>
                <p>This language doesn't have any lessons yet. Start by creating your first lesson.</p>
                <button className="primary-button" onClick={handleCreateLesson}>
                  Create First Lesson
                </button>
              </div>
            ) : (
              <div className="card-grid">
                {lessons.map((lesson) => (
                  <div className="list-card" key={lesson._id}>
                    <div className="card-header">
                      <div className="card-icon">📝</div>
                      <h3 className="card-title">{lesson.title}</h3>
                    </div>
                    <div className="card-content">
                      {lesson.description && (
                        <p className="lesson-description">{lesson.description}</p>
                      )}
                      <div className="info-item">
                        <span className="info-label">Lesson ID:</span>
                        <span className="info-value lesson-id">{lesson._id}</span>
                      </div>
                      {lesson.level && (
                        <div className="info-item">
                          <span className="info-label">Level:</span>
                          <span className="info-value">{lesson.level}</span>
                        </div>
                      )}
                    </div>
                    <div className="card-actions">
                      <button 
                        className="secondary-button" 
                        onClick={() => navigate(`/admin/lessons/${lesson._id}`)}
                      >
                        👁️ View Details
                      </button>
                      {/* <button 
                        className="icon-button" 
                        onClick={() => navigate(`/admin/edit-lesson/${lesson._id}`)}
                        title="Edit Lesson"
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

export default LanguageLessons;