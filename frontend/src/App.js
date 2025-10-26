import React, { useState, useEffect, createContext } from 'react';
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
import { Moon, Sun, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

// Backend URL configuration - connected to production backend
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://dexnote.onrender.com';
const API = `${BACKEND_URL}/api`;

export const AuthContext = createContext();
export const ThemeContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [mathQuestion, setMathQuestion] = useState('');
  const [mathSolution, setMathSolution] = useState(null);
  const [mathLoading, setMathLoading] = useState(false);

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

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const solveMathProblem = async () => {
    if (!mathQuestion.trim()) return;
    setMathLoading(true);
    try {
      const response = await axios.post(`${API}/ai/solve-math`, {
        question: mathQuestion
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setMathSolution(response.data);
    } catch (error) {
      setMathSolution({
        error: true,
        message: 'Failed to solve the problem. Please try again.'
      });
    } finally {
      setMathLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, API }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
          <HashRouter>
            {/* Enhanced navigation with theme toggle and AI Math Solver */}
            <nav className="w-full border-b bg-white/70 dark:bg-gray-800/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-800/60 transition-colors duration-200">
              <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4 text-sm">
                <Link className="font-semibold text-gray-900 dark:text-white" to="/">
                  DexNote
                </Link>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Link to="/courses">Courses</Link>
                  <Link to="/ai-tools">AI Tools</Link>
                  <Link to="/notes">Notes</Link>
                  <Link className="text-blue-600 dark:text-blue-400 font-medium" to="/math-magic">
                    MathMagic
                  </Link>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  {/* AI Math Solver Widget */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Calculator className="h-4 w-4" />
                        Math Solver
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px] dark:bg-gray-800 dark:text-white">
                      <DialogHeader>
                        <DialogTitle>AI Math Solver</DialogTitle>
                        <DialogDescription className="dark:text-gray-300">
                          Enter your math problem and get step-by-step solutions
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Textarea
                          placeholder="Enter your math question here... (e.g., Solve x^2 + 5x + 6 = 0)"
                          value={mathQuestion}
                          onChange={(e) => setMathQuestion(e.target.value)}
                          className="min-h-[100px] dark:bg-gray-700 dark:text-white"
                        />
                        <Button 
                          onClick={solveMathProblem} 
                          disabled={mathLoading || !mathQuestion.trim()}
                          className="w-full"
                        >
                          {mathLoading ? 'Solving...' : 'Solve Problem'}
                        </Button>
                        {mathSolution && (
                          <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                            {mathSolution.error ? (
                              <p className="text-red-600 dark:text-red-400">{mathSolution.message}</p>
                            ) : (
                              <div className="space-y-2">
                                <h4 className="font-semibold">Solution:</h4>
                                <div className="text-sm whitespace-pre-wrap">{mathSolution.solution}</div>
                                {mathSolution.steps && (
                                  <div className="mt-3">
                                    <h4 className="font-semibold">Steps:</h4>
                                    <ol className="list-decimal list-inside space-y-1 text-sm">
                                      {mathSolution.steps.map((step, idx) => (
                                        <li key={idx}>{step}</li>
                                      ))}
                                    </ol>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                  {/* Theme Toggle */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleTheme}
                    className="gap-2"
                    aria-label="Toggle theme"
                  >
                    {theme === 'light' ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                  </Button>
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
        </div>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
