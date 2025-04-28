// LanguagesPage.jsx - Shows all available languages
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import '../styles/AdminForms.css';
import "../../styles/LanguagesLesson.css";

const LanguagesPage = () => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/languages');
        setLanguages(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch languages');
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h3 className="admin-logo">Learner Dashboard</h3>
        <nav className="admin-nav">
          <Link to="/learner/dashboard" className="nav-item">
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link to="/learner/languages" className="nav-item active">
            <span className="nav-icon">🌎</span>
            <span>Languages</span>
          </Link>
          <Link to="/learner/languages" className="nav-item text-white d-block mb-3">
            <span className="nav-icon">👥</span>
            <span>Lessons</span>
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
          <h2>Available Languages</h2>
          <div className="breadcrumb">
            <Link to="/learner/dashboard" className="breadcrumb-link">Dashboard</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Languages</span>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading languages...</p>
          </div>
        ) : error ? (
          <div className="message error-message">{error}</div>
        ) : languages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🌎</div>
            <h3>No Languages Available</h3>
            <p>There are no languages available for learning yet.</p>
          </div>
        ) : (
          <div className="card-grid">
            {languages.map((language) => (
              <div className="list-card" key={language._id}>
                <div className="card-header">
                  <div className="card-icon">🌎</div>
                  <h3 className="card-title">{language.name}</h3>
                </div>
                <div className="card-content">
                  <div className="info-item">
                    <span className="info-label">Language Code:</span>
                    <span className="info-value">{language.code}</span>
                  </div>
                </div>
                <div className="card-actions">
                  <Link 
                    to={`/learner/languages/${language._id}/lessons`} 
                    className="primary-button"
                  >
                    View Lessons
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguagesPage;