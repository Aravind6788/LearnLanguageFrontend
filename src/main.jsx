import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Login from './components/Login.jsx';
import SignUpForm from './components/SignUpForm.jsx';
import Home from './components/Home.jsx';
import LanguageForm from './components/admin/LanguageForm.jsx';
import LanguagesList from './components/admin/LanguagesList.jsx';
import LanguageLessons from './components/admin/Languageslessons.jsx';
import CreateLesson from './components/admin/CreateLesson.jsx';
import LessonContent from './components/admin/LessonContent.jsx';
import UserPage from './components/admin/UserPage.jsx';
import Dashboard from './components/admin/Dashboard.jsx';
import LearnerLanguage from './components/learner/LearnerLanguages.jsx';
import LearnerLessons from './components/learner/LearnerLessons.jsx';
import LearnerLessonContent from './components/learner/LearnerLessonContent.jsx';

import LearnerDashboard from './components/learner/LearnerDashboard.jsx';
import ChatBot from './components/ChatBot.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<SignUpForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/admin/create-language" element={<LanguageForm/>} />   
        <Route path="/admin/languages" element={<LanguagesList/>} />       
        <Route path="/admin/languages/:id/lessons" element={<LanguageLessons />} />
        <Route path="/admin/languages/:id/create-lesson" element={<CreateLesson />} />
        <Route path="/admin/lessons/:id" element={<LessonContent />} />
        <Route path="/admin/users" element={<UserPage />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/learner/languages" element={<LearnerLanguage />} />
        <Route path="/learner/languages/:languageId/lessons" element={<LearnerLessons />} />
        <Route path="/learner/lessons/:lessonId" element={<LearnerLessonContent />} />
        <Route path="/learner/dashboard" element={<LearnerDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);