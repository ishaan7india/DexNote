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
        headers: {
          Authorization: `Bearer ${token}`
        }
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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const solveMath = async () => {
    if (!mathQuestion.trim()) return;
    
    setMathLoading(true);
    setMathSolution(null);
    
    try {
      const response = await axios.post(`${API}/math/solve`, {
        expression: mathQuestion
      });
      setMathSolution(response.data);
    } catch (error) {
      console.error('Error solving math problem:', error);
      setMathSolution({ error: 'Failed to solve the problem. Please try again.' });
    } finally {
      setMathLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, token }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className="min-h-screen bg-background text-foreground">
          <HashRouter>
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <Link to="/" className="text-2xl font-bold text-primary">DexNote</Link>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        aria-label="Open Math Solver"
                      >
                        <Calculator className="h-4 w-4" />
                        Math Solver
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Math Problem Solver</DialogTitle>
                        <DialogDescription>
                          Enter your math question below and get step-by-step solutions.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Textarea
                          placeholder="Enter your math problem (e.g., 2x + 5 = 15)"
                          value={mathQuestion}
                          onChange={(e) => setMathQuestion(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <Button 
                          onClick={solveMath} 
                          disabled={mathLoading || !mathQuestion.trim()}
                          className="w-full"
                        >
                          {mathLoading ? 'Solving...' : 'Solve'}
                        </Button>
                        
                        {mathSolution && (
                          <div className="mt-4 p-4 bg-secondary rounded-lg">
                            {mathSolution.error ? (
                              <p className="text-destructive">{mathSolution.error}</p>
                            ) : (
                              <div className="space-y-2">
                                <h3 className="font-semibold">Solution:</h3>
                                <div className="whitespace-pre-wrap">{mathSolution.solution || mathSolution.answer}</div>
                                {mathSolution.steps && (
                                  <div className="mt-2">
                                    <h4 className="font-semibold">Steps:</h4>
                                    <ol className="list-decimal list-inside space-y-1">
                                      {mathSolution.steps.map((step, index) => (
                                        <li key={index}>{step}</li>
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
