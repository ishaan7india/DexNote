import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, LogOut, User, TrendingUp, Clock, Award, FileText, Layout } from 'lucide-react';
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
      console.error('Failed to fetch streak');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeCourses = enrollments.filter(e => e.progress < 100);
  const completedCourses = enrollments.filter(e => e.progress === 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-xl text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome, {user?.username || 'User'}
          </h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
            data-testid="logout-btn"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Courses</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{enrollments.length}</p>
              </div>
              <BookOpen className="text-blue-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-teal-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Courses</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{activeCourses.length}</p>
              </div>
              <TrendingUp className="text-teal-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{completedCourses.length}</p>
              </div>
              <Award className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Current Streak</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{streak} days</p>
              </div>
              <Clock className="text-purple-600" size={32} />
            </div>
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick Access</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Courses Card */}
            <Link to="/courses" className="group">
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                    <BookOpen className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Courses</h3>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Browse and enroll in courses to expand your knowledge
                </p>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800">
                  Browse Courses
                </Button>
              </div>
            </Link>

            {/* Notes Card */}
            <Link to="/notes" className="group">
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-teal-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg flex items-center justify-center">
                    <FileText className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Notes</h3>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Create and manage your notes with whiteboard
                </p>
                <Button className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800">
                  Open Notes
                </Button>
              </div>
            </Link>

            {/* AI Tools Card */}
            <Link to="/ai-tools" className="group">
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                    <Layout className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">AI Tools</h3>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Access powerful AI-powered learning tools
                </p>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800">
                  Explore AI Tools
                </Button>
              </div>
            </Link>
          </div>
        </div>

        {/* My Courses Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">My Courses</h2>
          {activeCourses.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <p className="text-slate-600 mb-4">You haven't enrolled in any courses yet!</p>
              <Link to="/courses">
                <Button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700">
                  Browse Courses
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {activeCourses.map((enrollment) => (
                <Link
                  key={enrollment.id}
                  to={`/courses/${enrollment.course.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {enrollment.course.title}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {enrollment.course.description}
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                        In Progress
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Progress</span>
                        <span className="font-semibold text-slate-900">{enrollment.progress}%</span>
                      </div>
                      <Progress value={enrollment.progress} className="h-2" />
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
