import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
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
import MathMagicBlog from './pages/MathMagicBlog';
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
        {/* Public top nav simplified: ensure MathMagic is accessible */}
        <nav className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4 text-sm">
            <Link to="/" className="font-semibold">DexNote</Link>
            <div className="flex items-center gap-3 text-gray-700">
              <Link to="/courses">Courses</Link>
              <Link to="/ai-tools">AI Tools</Link>
              <Link to="/notes">Notes</Link>
              <Link to="/math-magic" className="text-blue-600 font-medium">MathMagic</Link>
            </div>
            <div className="ml-auto flex items-center gap-3">
              {user ? (
                <>
                  <Link to="/dashboard">Dashboard</Link>
                  <Link to="/profile">Profile</Link>
                </>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/signup">Sign up</Link>
                </>
              )}
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/math-magic" element={<MathMagicBlog />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={login} />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignupPage onLogin={login} />} />
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
