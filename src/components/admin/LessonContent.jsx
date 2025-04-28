import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom'; // Added Link import

const LessonPage = () => {
    const handleLogout = () => {
        // Clear user session or token (assuming you're using localStorage or cookies)
        localStorage.removeItem('token');  // or sessionStorage.clear() if using sessionStorage
        
        // Redirect to login page
        navigate('/login');  // Replace '/login' with the route of your login page
      };
  const { id } = useParams();  // Get the lesson ID from the URL
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/languages/6809e51159c06822fa4b43b8/lessons');
        const lessons = response.data;

        // Find the lesson that matches the ID from the URL
        const matchedLesson = lessons.find(lesson => lesson._id === id);

        if (matchedLesson) {
          setLesson(matchedLesson);
        } else {
          setError('Lesson not found');
        }

        setLoading(false);
      } catch (err) {
        setError('Error fetching lessons');
        setLoading(false);
      }
    };

    fetchLessons();
  }, [id]); // The effect will run again if the ID changes

  if (loading) return (
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
        <div style={styles.loading}>Loading...</div>
      </div>
    </div>
  );

  if (error) return (
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
      </div>
      <div className="admin-content">
        <div style={styles.error}>{error}</div>
      </div>
    </div>
  );

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
      </div>
      <div className="admin-content">
        {lesson ? (
          <div style={styles.lessonCard}>
            <h1 style={styles.title}>{lesson.title}</h1>
            <p><strong>Category:</strong> {lesson.category}</p>
            <p><strong>Type:</strong> {lesson.type}</p>
            <p><strong>Total Marks:</strong> {lesson.totalMarks}</p>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Contents:</h3>
              {lesson.contents.length > 0 ? (
                lesson.contents.map((content, index) => (
                  <div key={index} style={styles.contentItem}>
                    <p><strong>Text:</strong> {content.text}</p>
                    <p><strong>Meaning:</strong> {content.meaning}</p>
                    <p><strong>Example:</strong> {content.example}</p>
                    <p><strong>Difficulty:</strong> {content.difficulty}</p>
                    {content.audio && (
                      <audio controls src={content.audio} style={styles.audio}>
                        Your browser does not support the audio element.
                      </audio>
                    )}
                    <p><strong>Marks:</strong> {content.marks}</p>
                  </div>
                ))
              ) : (
                <p>No content available</p>
              )}
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>User Marks:</h3>
              {lesson.userMarks.length > 0 ? (
                lesson.userMarks.map((mark, index) => (
                  <div key={index} style={styles.markItem}>
                    <p><strong>User:</strong> {mark.user}</p>
                    <p><strong>Marks:</strong> {mark.marks}</p>
                  </div>
                ))
              ) : (
                <p>No marks available</p>
              )}
            </div>
          </div>
        ) : (
          <div style={styles.error}>Lesson not found</div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  lessonCard: {
    backgroundColor: '#f9f9f9',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '32px',
    marginBottom: '20px',
    color: '#333',
  },
  section: {
    marginTop: '30px',
  },
  sectionTitle: {
    fontSize: '24px',
    marginBottom: '15px',
    borderBottom: '2px solid #ddd',
    paddingBottom: '5px',
  },
  contentItem: {
    backgroundColor: '#fff',
    padding: '15px',
    marginBottom: '15px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
  },
  markItem: {
    backgroundColor: '#eef7ff',
    padding: '12px',
    marginBottom: '10px',
    border: '1px solid #cce0ff',
    borderRadius: '8px',
  },
  loading: {
    textAlign: 'center',
    fontSize: '24px',
    padding: '50px',
  },
  error: {
    textAlign: 'center',
    color: 'red',
    fontSize: '20px',
    padding: '50px',
  },
  audio: {
    marginTop: '10px',
  },
};

export default LessonPage;