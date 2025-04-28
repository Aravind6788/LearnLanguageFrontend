import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UsersPage = () => {
    const handleLogout = () => {
        // Clear user session or token (assuming you're using localStorage or cookies)
        localStorage.removeItem('token');  // or sessionStorage.clear() if using sessionStorage
        
        // Redirect to login page
        navigate('/login');  // Replace '/login' with the route of your login page
      };
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://learnlanguage-9gzy.onrender.com/api/auth/getAllUsers');
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h3 className="admin-logo">Admin Dashboard</h3>
        <nav className="admin-nav">
          <Link to="/admin/dashboard" className="nav-item">
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/languages" className="nav-item">
            <span className="nav-icon">🌎</span>
            <span>Languages</span>
          </Link>
          {/*  {/* <Link to="/admin/lessons" className="nav-item">
            <span className="nav-icon">📚</span>
            <span>Lessons</span>
          </Link> */} 
          <Link to="/admin/users" className="nav-item active">
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
        {/* <div className="content-header">
          <h2>Users</h2>
          <button className="primary-button">
            <span>➕</span> Add New User
          </button>
        </div> */}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No users found</h3>
            <p>There are currently no users in the system.</p>
            <button className="primary-button">
              <span>➕</span> Add First User
            </button>
          </div>
        ) : (
          <div className="grid-container">
            <div className="card-grid">
              {users.map((user) => (
                <div key={user._id} className="list-card">
                  <div className="card-header">
                    <span className="card-icon">
                      {user.role === 'admin' ? '👑' : '👤'}
                    </span>
                    <h3 className="card-title">{user.username}</h3>
                  </div>
                  <div className="card-content">
                    <div className="info-item">
                      <span className="info-label">Email:</span>
                      <span className="info-value">{user.email}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Role:</span>
                      <span className="info-value" style={{
                        color: user.role === 'admin' ? '#E53E3E' : '#38B2AC'
                      }}>
                        {user.role}
                      </span>
                    </div>
                    {/* <div className="info-item">
                      <span className="info-label">Level:</span>
                      <span className="info-value">{user.level}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">XP:</span>
                      <span className="info-value">{user.xp}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Badges:</span>
                      <span className="info-value">{user.badges?.length || 0}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Progress Items:</span>
                      <span className="info-value">{user.progress?.length || 0}</span>
                    </div> */}
                  </div>
                  {/* <div className="card-actions">
                    <Link 
                      to={`/admin/users/${user._id}`} 
                      className="secondary-button"
                    >
                      <span>👁️</span> View Details
                    </Link>
                    <Link 
                      to={`/admin/users/edit/${user._id}`} 
                      className="secondary-button"
                    >
                      <span>✏️</span> Edit
                    </Link>
                  </div> */}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;