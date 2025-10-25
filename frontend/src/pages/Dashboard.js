import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, LogOut, User, TrendingUp, Clock, Award } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEnrollments();
    fetchStreak();
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

  const fetchStreak = async () => {
    try {
      const response = await axios.get(`${API}/streak`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStreak(response.data.streak || 0);
    } catch (error) {
      console.error('Failed to load streak');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  // Filter enrollments for active courses (progress < 100)
  const activeCourses = enrollments.filter(enrollment => enrollment.progress < 100);
  // Filter enrollments for completed courses (progress === 100)
  const completedCourses = enrollments.filter(enrollment => enrollment.progress === 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/dashboard">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                DexNote
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-slate-600">
                Welcome, <span className="font-semibold text-slate-900">{user?.username || 'User'}</span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
                data-testid="logout-btn"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Courses</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{enrollments.length}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Courses</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{activeCourses.length}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{completedCourses.length}</p>
              </div>
              <div className="bg-teal-100 rounded-full p-3">
                <Award className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Current Streak</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{streak} days</p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* My Courses Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">My Courses</h2>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Loading your courses...</p>
            </div>
          ) : activeCourses.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">No active courses enrolled yet</p>
              <Link to="/courses">
                <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                  Browse Courses
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCourses.map((enrollment) => (
                <Link
                  key={enrollment.id}
                  to={`/course/${enrollment.course.id}`}
                  className="block"
                  data-testid={`course-${enrollment.course.id}`}
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 h-full">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-slate-900 line-clamp-2">
                          {enrollment.course.title}
                        </h3>
                      </div>
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
                    <div className="p-6 pt-0">
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
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* My Completed Courses Section */}
        {completedCourses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">My Completed Courses</h2>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-wrap gap-3">
                {completedCourses.map((enrollment) => (
                  <Badge
                    key={enrollment.id}
                    variant="secondary"
                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-green-500 to-teal-600 text-white hover:from-green-600 hover:to-teal-700"
                  >
                    {enrollment.course.title}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
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
