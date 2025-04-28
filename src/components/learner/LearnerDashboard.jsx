import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BookOpen, Award, Languages as LanguagesIcon, CheckCircle, Clock, Target } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE_URL = "http://localhost:5000/api";

export default function LearnerDashboard() {
  const [stats, setStats] = useState({
    languagesLearning: 0,
    lessonsCompleted: 0,
    totalMarks: 0,
    xp: 0,
    level: 0,
    languages: []
  });

  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [languageProgress, setLanguageProgress] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [recommendedLessons, setRecommendedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Not authenticated');
        }
        const response = await axios.get(`${API_BASE_URL}/users/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
        if (response.data.languages && response.data.languages.length > 0) {
          setSelectedLanguage(response.data.languages[0]);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchLanguageProgress = async () => {
      if (!selectedLanguage) return;
      try {
        setLoading(true);
        const token = localStorage.getItem('token'); // Use consistent token key
        
        // This URL should match your backend route exactly
        const response = await axios.get(
          `${API_BASE_URL}/users/language-progress/${selectedLanguage.id}`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const progressByCategory = response.data.progressByCategory;
        
        const barData = progressByCategory.map(category => ({
          name: category.category,
          completed: category.completed,
          remaining: category.total - category.completed
        }));
    
        const pieData = progressByCategory.map(category => ({
          name: category.category,
          value: category.completed
        }));
    
        setLanguageProgress({ barData, pieData });
      } catch (err) {
        console.error('Error fetching language progress:', err);
        setError('Failed to load language progress');
      } finally {
        setLoading(false);
      }
    };

    fetchLanguageProgress();
  }, [selectedLanguage]);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/users/dashboard/activity`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const formattedActivity = response.data.map(item => ({
          ...item,
          date: formatRelativeTime(new Date(item.date))
        }));
        
        setRecentActivity(formattedActivity);
      } catch (err) {
        console.error('Error fetching recent activity:', err);
      }
    };

    fetchRecentActivity();
  }, []);

  useEffect(() => {
    setRecommendedLessons([
      { language: "English", title: "Common Phrases 1", duration: "5 mins", description: "Learn everyday expressions" },
      { language: "Spanish", title: "Basic Verbs", duration: "8 mins", description: "Essential verbs for beginners" },
      { language: "French", title: "Introductions", duration: "4 mins", description: "How to introduce yourself" }
    ]);
  }, []);

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString();
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirect to login page after logout
  };

  if (loading && !stats.languages.length) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <div className="bg-white p-4 rounded shadow-sm max-w-md w-100 text-center">
          <div className="text-danger mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="h5 mb-2">Error Loading Dashboard</h2>
          <p className="text-muted mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="admin-sidebar bg-dark text-white p-3" style={{ minWidth: "250px",height:"100vh" }}>
        <h3 className="admin-logo">Learner Dashboard</h3>
        <nav className="admin-nav">
          <Link to="/learner/dashboard" className="nav-item text-white d-block mb-3 active">
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link to="/learner/languages" className="nav-item text-white d-block mb-3 ">
            <span className="nav-icon">🌎</span>
            <span>Languages</span>
          </Link>
          <Link to="/learner/languages" className="nav-item text-white d-block mb-3">
            <span className="nav-icon">👥</span>
            <span>Lessons</span>
          </Link>
        </nav>
        <div className="logout-section">
          <button className="logout-button btn btn-danger w-100" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 bg-light p-5">
        <h1 className="h2 mb-4 text-dark">Language Learning Dashboard</h1>

        {/* Overview Stats */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 mb-4">
          <StatCard 
            title="Languages Learning" 
            value={stats.languagesLearning} 
            icon={<LanguagesIcon size={24} className="text-primary" />} 
            color="primary"
          />
          <StatCard 
            title="Lessons Completed" 
            value={stats.lessonsCompleted} 
            icon={<CheckCircle size={24} className="text-success" />} 
            color="success"
          />
          <StatCard 
            title="Total Marks" 
            value={stats.totalMarks} 
            icon={<Award size={24} className="text-warning" />} 
            color="warning"
          />
          <StatCard 
            title="XP Level" 
            value={`${stats.xp} XP | Level ${stats.level}`} 
            icon={<Target size={24} className="text-info" />} 
            color="info"
          />
        </div>

        {/* Languages Selection */}
        <div className="mb-4">
          <h2 className="h4 mb-3 text-dark">My Languages</h2>
          <div className="btn-group flex-wrap">
            {stats.languages.map((language) => (
              <button
                key={language.id}
                onClick={() => handleLanguageSelect(language)}
                className={`btn ${selectedLanguage?.id === language.id ? 'btn-primary' : 'btn-outline-secondary'} mb-2`}
              >
                {language.name} ({language.progress}%)
              </button>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        {selectedLanguage && languageProgress.barData && (
          <div className="row row-cols-1 row-cols-md-2 mb-4">
            {/* Progress Chart */}
            <div className="col mb-4">
              <div className="bg-white p-4 rounded shadow-sm">
                <h2 className="h5 mb-3 text-dark">{selectedLanguage.name} Progress</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={languageProgress.barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" stackId="a" fill="#28a745" name="Completed" />
                    <Bar dataKey="remaining" stackId="a" fill="#d1d5db" name="Remaining" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Distribution Chart */}
            <div className="col mb-4">
              <div className="bg-white p-4 rounded shadow-sm">
                <h2 className="h5 mb-3 text-dark">Learning Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={languageProgress.pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {languageProgress.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white p-4 rounded shadow-sm mb-4">
          <h2 className="h5 mb-4 text-dark">Recent Activity</h2>
          {recentActivity.length > 0 ? (
            <ul className="list-unstyled">
              {recentActivity.map((activity, index) => (
                <li key={index} className="d-flex align-items-start p-3 border-bottom">
                  <div className={`bg-${activity.type === 'lesson' ? 'info' : 'warning'} text-white rounded-circle p-2 mr-3`}>
                    {activity.type === 'lesson' ? (
                      <BookOpen size={20} className="text-white" />
                    ) : (
                      <Award size={20} className="text-white" />
                    )}
                  </div>
                  <div>
                    <h5 className="mb-1">{activity.title}</h5>
                    <p className="mb-1">{activity.language} - {activity.marks} marks</p>
                    <small className="text-muted">{activity.date}</small>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted text-center py-3">No recent activity found</p>
          )}
          <button className="btn btn-link text-primary">
            <Clock size={16} className="mr-2" /> View all activity
          </button>
        </div>

        {/* Recommended Lessons */}
        <div className="bg-white p-4 rounded shadow-sm">
          <h2 className="h5 mb-4 text-dark">Recommended Next Lessons</h2>
          <div className="row">
            {recommendedLessons.map((lesson, index) => (
              <div key={index} className="col-12 col-md-4 mb-4">
                <div className="card border-light shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{lesson.title}</h5>
                    <p className="card-text">{lesson.description}</p>
                    <p className="text-muted">{lesson.language} - {lesson.duration}</p>
                    <button className="btn btn-primary btn-sm">Start Lesson</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, color }) {
  return (
    <div className={`col mb-4`}>
      <div className={`card border-${color} shadow-sm`}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="small text-muted">{title}</p>
              <h4 className="mb-0">{value}</h4>
            </div>
            <div className={`bg-${color} text-white p-3 rounded-circle`}>{icon}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
