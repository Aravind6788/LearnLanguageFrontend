// LearnerLessons.jsx - Shows all lessons for a specific language
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../styles/LanguagesLesson.css";

const LearnerLessons = () => {
  const { languageId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [language, setLanguage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressUpdating, setProgressUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lessonsResponse = await axios.get(`https://learnlanguage-9gzy.onrender.com/api/languages/${languageId}/lessons`);
        setLessons(lessonsResponse.data);

        const languageResponse = await axios.get(`https://learnlanguage-9gzy.onrender.com/api/languages/${languageId}`);
        setLanguage(languageResponse.data);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch lessons');
        setLoading(false);
      }
    };

    fetchData();
  }, [languageId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleStartLesson = async (lessonId) => {
    try {
      setProgressUpdating(true);
      
      // Get user ID from localStorage
      const userData = JSON.parse(localStorage.getItem('user'));
      const userId = userData?.id;
      
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      // Get auth token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }
      
      try {
        // Update user progress to add the language
        await axios({
          method: 'POST',
          url: `https://learnlanguage-9gzy.onrender.com/api/updates/${userId}/add-language`,
          data: { languageId },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        // If successful, language was added
        console.log('Language successfully added to progress');
      } catch (progressErr) {
        // Check if error is "Language already added" - this is actually fine
        if (progressErr.response && 
            progressErr.response.data && 
            progressErr.response.data.message === 'Language already added.') {
          console.log('Language was already added to progress - continuing');
          // Don't rethrow the error, just continue
        } else {
          // For any other error, rethrow it
          throw progressErr;
        }
      }

      // Continue with navigation regardless of whether language was newly added
      // or was already in the progress
      navigate(`/learner/lessons/${lessonId}`);
    } catch (err) {
      console.error("Failed to update progress:", err);
      
      // More detailed error information for real errors (not the "already added" case)
      if (err.response) {
        console.error("Error response data:", err.response.data);
        setError(`Failed to update progress: ${err.response.data.message || 'Server error'}`);
      } else {
        setError("Failed to update progress. Please try again.");
      }
    } finally {
      setProgressUpdating(false);
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h3 className="admin-logo">Learner Dashboard</h3>
        <nav className="admin-nav">
          <Link to="/learner/dashboard" className="nav-item">
            <span className="nav-icon">📊</span> <span>Dashboard</span>
          </Link>
          <Link to="/learner/languages" className="nav-item ">
            <span className="nav-icon">🌎</span> <span>Languages</span>
          </Link>
          <Link to="/learner/languages" className="nav-item text-white d-block mb-3 active">
            <span className="nav-icon">👥</span>
            <span>Lessons</span>
          </Link>
          <Link to="/chatbot" className="nav-item text-white d-block mb-3">
            <span className="nav-icon">🤖</span>
            <span> Chat Bot</span>
          </Link>
        </nav>
        <div className="logout-section">
          <button className="logout-button" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <div className="content-header">
          <h2>{language ? `${language.name} Lessons` : 'Lessons'}</h2>
          <div className="breadcrumb">
            <Link to="/learner/dashboard" className="breadcrumb-link">Dashboard</Link>
            <span className="breadcrumb-separator">/</span>
            <Link to="/learner/languages" className="breadcrumb-link">Languages</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{language ? language.name : 'Lessons'}</span>
          </div>
        </div>

        {/* Error message for progress update failure */}
        {error && <div className="message error-message">{error}</div>}

        {/* Loader / Error / Empty / Lessons */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading lessons...</p>
          </div>
        ) : lessons.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No Lessons Available</h3>
            <p>There are no lessons available for this language yet.</p>
          </div>
        ) : (
          <div className="card-grid">
            {lessons.map((lesson) => {
              // Extract obtained marks safely
              let obtainedMarks = 0;
              if (lesson.userMarks) {
                if (typeof lesson.userMarks === 'object') {
                  obtainedMarks = lesson.userMarks.obtainedMarks || 0;
                } else if (typeof lesson.userMarks === 'number') {
                  obtainedMarks = lesson.userMarks;
                }
              }

              return (
                <div className="list-card" key={lesson._id}>
                  <div className="card-header">
                    <div className="card-icon">
                      {lesson.type === 'word' ? '🔤' : lesson.type === 'sentence' ? '📝' : '📚'}
                    </div>
                    <h3 className="card-title">{lesson.title}</h3>
                  </div>
                  <div className="card-content">
                    <p className="lesson-description">
                      {lesson.category} • {lesson.type} • {lesson.contents?.length || 0} items
                    </p>
                    <div className="info-item">
                      <span className="info-label">Your Score:</span>
                      <span className="info-value">{obtainedMarks} / {lesson.totalMarks || 0}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button 
                      onClick={() => handleStartLesson(lesson._id)} 
                      className="primary-button"
                      disabled={progressUpdating}
                    >
                      {progressUpdating ? "Loading..." : "Start Lesson"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnerLessons;