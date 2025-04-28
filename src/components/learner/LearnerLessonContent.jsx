import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../styles/LanguagesLesson.css";

const LearnerLessonsContent = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [contentScore, setContentScore] = useState(0);
  const [overallScore, setOverallScore] = useState(0);
  const [userId, setUserId] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        let currentUserId = localStorage.getItem('userId');

        if (!currentUserId || currentUserId === 'undefined' || currentUserId === 'null') {
          try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
              const user = JSON.parse(userStr);
              if (user?.id) {
                currentUserId = user.id;
              } else if (user?._id) {
                currentUserId = user._id;
              }
              if (currentUserId) {
                localStorage.setItem('userId', currentUserId);
              }
            }
          } catch (err) {
            console.error("Error parsing user data:", err);
          }
        }

        if (!currentUserId || currentUserId === 'undefined' || currentUserId === 'null') {
          setError('User ID not found. Please log in again.');
          navigate('/login');
          return;
        }

        setUserId(currentUserId);

        const response = await axios.get(`https://learnlanguage-9gzy.onrender.com/api/lessons/${lessonId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setLesson(response.data);
        setOverallScore(Number(response.data.userMarks) || 0); // ✅ Fix here
        setLoading(false);
      } catch (err) {
        console.error("Error fetching lesson:", err);
        setError('Failed to fetch lesson details');
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        processAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error("Microphone access error:", err);
      setError('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const processAudio = async (blob) => {
    try {
      const currentUserId = userId || localStorage.getItem('userId');

      if (!currentUserId) {
        setError('User ID not found. Please log in again.');
        navigate('/login');
        return;
      }

      const score = Math.floor(Math.random() * 3) + 8; // random score 8-10
      setContentScore(score);

      const token = localStorage.getItem('token');

      // Update single content mark
      await axios.put(
        `https://learnlanguage-9gzy.onrender.com/api/lessons/${lessonId}/content/${currentContentIndex}`,
        { marks: score },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const currentOverallScore = Number(overallScore) || 0;
      const newOverallScore = currentOverallScore + score;
      setOverallScore(newOverallScore);

      const userMarkPayload = {
        userId: currentUserId,
        obtainedMarks: Number(newOverallScore) // ✅ Always number here
      };

      console.log("Sending user mark payload:", userMarkPayload);

      try {
        const response = await axios.put(
          `https://learnlanguage-9gzy.onrender.com/api/lessons/${lessonId}/user-mark`,
          userMarkPayload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Score update response:", response.data);
      } catch (markError) {
        console.error("Mark update error:", markError.response?.data || markError.message);
        if (markError.response?.status === 400 && markError.response?.data?.msg === 'Invalid userId format') {
          setError('Invalid user ID format. Please log out and log in again.');
        } else {
          setError(`Failed to update score: ${markError.response?.data?.msg || markError.message}`);
        }
      }

      if (score >= 9) {
        setFeedback({ message: 'Excellent pronunciation!', type: 'success' });
      } else if (score >= 7) {
        setFeedback({ message: 'Good job! Keep practicing.', type: 'success' });
      } else {
        setFeedback({ message: 'Try again with clearer pronunciation.', type: 'error' });
      }
    } catch (err) {
      console.error("Error processing audio:", err);
      setError(`Failed to process audio: ${err.message}`);
    }
  };

  const playReferenceAudio = () => {
    if (lesson?.contents?.[currentContentIndex]) {
      const audio = new Audio(lesson.contents[currentContentIndex].audio);
      audio.play();
    }
  };

  const nextContent = () => {
    if (currentContentIndex < lesson.contents.length - 1) {
      setCurrentContentIndex(currentContentIndex + 1);
      setFeedback(null);
      setContentScore(0);
      setAudioBlob(null);
    } else {
      navigate(`/learner/languages/${lesson.languageId}/lessons`);
    }
  };

  const currentContent = lesson?.contents?.[currentContentIndex] || null;

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h3 className="admin-logo">Learner Dashboard</h3>
        <nav className="admin-nav">
          <Link to="/learner/dashboard" className="nav-item">📊 Dashboard</Link>
          <Link to="/learner/languages" className="nav-item ">🌎 Languages</Link>
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
          <button className="logout-button" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading lesson...</p>
          </div>
        ) : error ? (
          <div className="message error-message">{error}</div>
        ) : lesson ? (
          <>
            <div className="content-header">
              <h2>{lesson.title}</h2>
              <div className="breadcrumb">
                <Link to="/learner/dashboard" className="breadcrumb-link">Dashboard</Link>
                <span className="breadcrumb-separator">/</span>
                <Link to="/learner/languages" className="breadcrumb-link">Languages</Link>
                <span className="breadcrumb-separator">/</span>
                <Link to={`/learner/languages/${lesson.languageId}/lessons`} className="breadcrumb-link">Lessons</Link>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">{lesson.title}</span>
              </div>
            </div>

            <div className="lesson-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${((currentContentIndex + 1) / lesson.contents.length) * 100}%` }}></div>
              </div>
              <div className="progress-text">
                {currentContentIndex + 1} of {lesson.contents.length}
              </div>
            </div>

            {currentContent && (
              <div className="content-card">
                <div className="content-header">
                  <h3>{currentContent.text}</h3>
                  <div className="content-meaning">{currentContent.meaning}</div>
                </div>

                <div className="content-example">
                  <strong>Example:</strong> {currentContent.example}
                </div>

                <div className="audio-controls">
                  {/* <button className="secondary-button" onClick={playReferenceAudio}>🔊 Listen</button> */}

                  {!recording && !audioBlob && (
                    <button className="primary-button" onClick={startRecording}>🎤 Start Recording</button>
                  )}
                  {recording && (
                    <button className="primary-button recording" onClick={stopRecording}>⏹️ Stop Recording</button>
                  )}
                  {audioBlob && (
                    <div className="audio-playback">
                      <audio controls src={URL.createObjectURL(audioBlob)}></audio>
                    </div>
                  )}
                </div>

                {feedback && (
                  <div className={`message ${feedback.type === 'success' ? 'success-message' : 'error-message'}`}>
                    {feedback.message}
                    {contentScore > 0 && (
                      <div className="score-display">
                        Score: {contentScore}/10
                      </div>
                    )}
                  </div>
                )}

                <div className="navigation-buttons">
                  <button
                    className="primary-button"
                    onClick={nextContent}
                    disabled={!feedback}
                  >
                    {currentContentIndex < lesson.contents.length - 1 ? 'Next' : 'Finish Lesson'}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">❓</div>
            <h3>Lesson Not Found</h3>
            <p>The requested lesson could not be found.</p>
            <Link to="/learner/languages" className="primary-button">
              Back to Languages
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnerLessonsContent;
