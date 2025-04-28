import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "../../styles/Dashboard.css"; // Using our shared admin CSS file
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session or token (assuming you're using localStorage or cookies)
    localStorage.removeItem('token');  // or sessionStorage.clear() if using sessionStorage
    
    // Redirect to login page
    navigate('/login');  // Replace '/login' with the route of your login page
  };

    const [stats, setStats] = useState({
    languages: 0,
    lessons: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get the token from localStorage
  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch all data concurrently
        const [languagesRes, usersRes] = await Promise.all([
          axios.get('https://learnlanguage-9gzy.onrender.com/api/languages'),
          axios.get('https://learnlanguage-9gzy.onrender.com/api/auth/getAllUsers', authHeader)
        ]);
        
        // Calculate total lessons from all languages
        let totalLessons = 0;
        
        // For each language, fetch its lessons
        const lessonPromises = languagesRes.data.map(language => 
          axios.get(`https://learnlanguage-9gzy.onrender.com/api/languages/${language._id}/lessons`)
        );
        
        const lessonResults = await Promise.all(lessonPromises);
        
        // Count total lessons
        lessonResults.forEach(result => {
          totalLessons += result.data.length;
        });
        
        setStats({
          languages: languagesRes.data.length,
          lessons: totalLessons,
          users: usersRes.data.length
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
  <h3 className="admin-logo">Admin Dashboard</h3>
  <nav className="admin-nav">
    <Link to="/admin/dashboard" className="nav-item active">
      <span className="nav-icon">📊</span>
      <span>Dashboard</span>
    </Link>
    <Link to="/admin/languages" className="nav-item">
      <span className="nav-icon">🌎</span>
      <span>Languages</span>
    </Link>
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
          <h2>Dashboard</h2>
          <div></div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-icon">🌎</div>
                <div className="stat-content">
                  <h3 className="stat-number">{stats.languages}</h3>
                  <p className="stat-label">Languages</p>
                </div>
                <Link to="/admin/languages" className="stat-link">View All</Link>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-content">
                  <h3 className="stat-number">{stats.lessons}</h3>
                  <p className="stat-label">Lessons</p>
                </div>
                <Link to="/admin/languages" className="stat-link">View All</Link>
              </div>

              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3 className="stat-number">{stats.users}</h3>
                  <p className="stat-label">Users</p>
                </div>
                <Link to="/admin/lessons" className="stat-link">View All</Link>
              </div>
            </div>

            <div className="dashboard-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <Link to="/admin/create-language" className="action-button">
                  <span className="action-icon">➕</span>
                  <span>Add Language</span>
                </Link>
                <Link to="/admin/lessons" className="action-button">
                  <span className="action-icon">➕</span>
                  <span>Add Lesson</span>
                </Link>
                {/* <Link to="/admin/users/create" className="action-button">
                  <span className="action-icon">➕</span>
                  <span>Add User</span>
                </Link> */}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;