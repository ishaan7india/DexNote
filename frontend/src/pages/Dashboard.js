import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, LogOut, User, TrendingUp, Clock, Award } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await axios.get(`${API}/enrollments/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnrollments(response.data);
    } catch (error) {
      toast.error('Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            DexNote
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/courses">
              <Button variant="ghost" data-testid="nav-courses-btn">All Courses</Button>
            </Link>
            <Link to="/ai-tools">
              <Button variant="ghost" data-testid="nav-ai-tools-btn">AI Tools</Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout} data-testid="logout-btn">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }} data-testid="dashboard-welcome">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-slate-600 text-lg">Continue your learning journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-200" data-testid="stat-enrolled-courses">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900">{enrollments.length}</div>
                <div className="text-slate-600">Enrolled Courses</div>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-200" data-testid="stat-avg-progress">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900">
                  {enrollments.length > 0 
                    ? Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length)
                    : 0}%
                </div>
                <div className="text-slate-600">Avg Progress</div>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-200" data-testid="stat-completed-courses">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900">
                  {enrollments.filter(e => e.progress === 100).length}
                </div>
                <div className="text-slate-600">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              My Courses
            </h2>
            <Link to="/courses">
              <Button variant="outline" data-testid="browse-courses-btn">Browse More Courses</Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-600">Loading your courses...</div>
          ) : enrollments.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-sm p-12 rounded-2xl border border-slate-200 text-center" data-testid="no-enrollments">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No courses enrolled yet</h3>
              <p className="text-slate-600 mb-6">Start your learning journey by enrolling in a course</p>
              <Link to="/courses">
                <Button data-testid="explore-courses-btn" className="bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700">
                  Explore Courses
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigate(`/courses/${enrollment.course.id}`)}
                  data-testid={`enrolled-course-${enrollment.course.id}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {enrollment.course.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {enrollment.course.duration}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                          {enrollment.course.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-600 mb-4 line-clamp-2">
                    {enrollment.course.description}
                  </p>

                  <div>
                    <div className="flex justify-between items-center mb-2 text-sm">
                      <span className="text-slate-600">Progress</span>
                      <span className="font-bold text-slate-900">{Math.round(enrollment.progress)}%</span>
                    </div>
                    <Progress value={enrollment.progress} className="h-2" data-testid={`progress-${enrollment.course.id}`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Profile Button at Bottom */}
      <div className="fixed bottom-6 right-6">
        <Link to="/profile">
          <Button
            size="lg"
            className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 shadow-xl"
            data-testid="profile-btn"
          >
            <User className="w-6 h-6" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
