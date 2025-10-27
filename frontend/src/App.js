import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import '@/App.css';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import AIToolsPage from './pages/AIToolsPage';
import ProfilePage from './pages/ProfilePage';
import NotesPage from './pages/NotesPage';
import { Toaster } from '@/components/ui/sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const API = `${BACKEND_URL}/api`;

export const AuthContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser(response.data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, API }}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignupPage />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/courses" element={user ? <CoursesPage /> : <Navigate to="/login" />} />
          <Route path="/courses/:courseId" element={user ? <CourseDetailPage /> : <Navigate to="/login" />} />
          <Route path="/ai-tools" element={user ? <AIToolsPage /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/notes" element={user ? <NotesPage /> : <Navigate to="/login" />} />
        </Routes>
      </HashRouter>
      <Toaster position="top-right" />
    </AuthContext.Provider>
  );
}

export default App;
