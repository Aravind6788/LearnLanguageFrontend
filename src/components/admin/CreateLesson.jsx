import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/LanguageForm.css"; // Using the same form CSS file

const CreateLesson = () => {
    const handleLogout = () => {
        // Clear user session or token (assuming you're using localStorage or cookies)
        localStorage.removeItem('token');  // or sessionStorage.clear() if using sessionStorage
        
        // Redirect to login page
        navigate('/login');  // Replace '/login' with the route of your login page
      };
  const { languageId } = useParams();
  const [languages, setLanguages] = useState([]);
  const [formData, setFormData] = useState({
    languageId: languageId || "",
    category: "essentials",
    type: "word",
    title: "",
    contents: [
      {
        text: "",
        meaning: "",
        example: "",
        audio: "",
        difficulty: "easy",
        marks: 0
      }
    ],
    totalMarks: 0
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    // Protect page: Only allow Admins
    if (!token || role !== "admin") {
      navigate("/login");
      return;
    }

    // Fetch available languages if no languageId was provided in the URL
    if (!languageId) {
      const fetchLanguages = async () => {
        try {
          const res = await axios.get("http://localhost:5000/api/languages", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setLanguages(res.data);
          console.log(res.data);
          // Set first language as default if available
          if (res.data.length > 0 && !formData.languageId) {
            setFormData(prev => ({
              ...prev,
              languageId: res.data[0]._id
            }));

          }
        } catch (err) {
          setMessage("Failed to load languages");
        }
      };
      fetchLanguages();
    }
  }, [token, role, navigate, languageId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContentChange = (index, field, value) => {
    const updatedContents = [...formData.contents];
    updatedContents[index][field] = value;
    setFormData({ ...formData, contents: updatedContents });
  };

  const addContentItem = () => {
    setFormData({
      ...formData,
      contents: [
        ...formData.contents,
        {
          text: "",
          meaning: "",
          example: "",
          audio: "",
          difficulty: "easy",
          marks: 0
        }
      ]
    });
  };

  const removeContentItem = (index) => {
    if (formData.contents.length > 1) {
      const updatedContents = formData.contents.filter((_, i) => i !== index);
      setFormData({ ...formData, contents: updatedContents });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(
        "http://localhost:5000/api/lessons",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Lesson created successfully!");
      
      setTimeout(() => {
        if (languageId) {
          navigate(`/admin/languages/${languageId}/lessons`);
        } else {
          navigate("/admin/languages");
        }
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create lesson.");
    } finally {
      setLoading(false);
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
          <Link to="/admin/languages" className="nav-item">
            <span className="nav-icon">🌎</span>
            <span>Languages</span>
          </Link>
          <Link to="/admin/lessons" className="nav-item active">
            <span className="nav-icon">📚</span>
            <span>Lessons</span>
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
          <h2>Create New Lesson</h2>
          <Link 
            to={languageId ? `/admin/languages/${languageId}/lessons` : "/admin/lessons"} 
            className="secondary-button"
          >
            Back to Lessons
          </Link>
        </div>
        
        <div className="form-card">
          <form onSubmit={handleSubmit} className="admin-form">
            {!languageId && (
              <div className="form-group">
                <label htmlFor="languageId">Language</label>
                <select
                  id="languageId"
                  name="languageId"
                  value={formData.languageId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a language</option>
                  {languages.map(lang => (
                    <option key={lang._id} value={lang._id}>
                      {lang.name} ({lang.code})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="title">Lesson Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="e.g., Greetings - Basics"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="essentials">Essentials</option>
                <option value="travel">Travel</option>
                <option value="business">Business</option>
                <option value="everyday">Everyday</option>
                <option value="culture">Culture</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="type">Lesson Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="word">Word</option>
                <option value="phrase">Phrase</option>
                <option value="sentence">Sentence</option>
                <option value="conversation">Conversation</option>
                <option value="grammar">Grammar</option>
              </select>
            </div>

            <div className="content-section">
              <div className="section-header">
                <h3>Lesson Contents</h3>
                <button 
                  type="button" 
                  className="secondary-button" 
                  onClick={addContentItem}
                >
                  Add Item
                </button>
              </div>

              {formData.contents.map((content, index) => (
                <div key={index} className="content-item">
                  <div className="content-header">
                    <h4>Item {index + 1}</h4>
                    {formData.contents.length > 1 && (
                      <button 
                        type="button" 
                        className="icon-button" 
                        onClick={() => removeContentItem(index)}
                        title="Remove Item"
                      >
                        ❌
                      </button>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor={`text-${index}`}>Text</label>
                    <input
                      type="text"
                      id={`text-${index}`}
                      value={content.text}
                      onChange={(e) => handleContentChange(index, "text", e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor={`meaning-${index}`}>Meaning</label>
                    <input
                      type="text"
                      id={`meaning-${index}`}
                      value={content.meaning}
                      onChange={(e) => handleContentChange(index, "meaning", e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor={`example-${index}`}>Example</label>
                    <input
                      type="text"
                      id={`example-${index}`}
                      value={content.example}
                      onChange={(e) => handleContentChange(index, "example", e.target.value)}
                      required
                    />
                  </div>

                  {/* <div className="form-group">
                    <label htmlFor={`audio-${index}`}>Audio Path</label>
                    <input
                      type="text"
                      id={`audio-${index}`}
                      value={content.audio}
                      placeholder="/audio/filename.mp3"
                      onChange={(e) => handleContentChange(index, "audio", e.target.value)}
                    />
                    <small className="form-help">Path to audio file (optional)</small>
                  </div> */}

                  <div className="form-group">
                    <label htmlFor={`difficulty-${index}`}>Difficulty</label>
                    <select
                      id={`difficulty-${index}`}
                      value={content.difficulty}
                      onChange={(e) => handleContentChange(index, "difficulty", e.target.value)}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="submit" 
              className="primary-button" 
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Lesson"}
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

export default CreateLesson;