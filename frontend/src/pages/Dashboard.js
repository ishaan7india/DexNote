import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Button } from '@/components/ui/button';
import { BookOpen, LogOut, User, FileText, Layout } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Welcome, {user?.full_name || user?.username}!
              </h1>
              <p className="text-gray-600 mt-2">Explore courses and resources</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-600"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Access Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Courses Card */}
            <Link
              to="/courses"
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 mb-4 mx-auto">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2 text-slate-800">
                Browse Courses
              </h3>
              <p className="text-gray-600 text-center text-sm">
                Explore all available courses
              </p>
            </Link>

            {/* Study Materials Card */}
            <Link
              to="/notes"
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-4 mx-auto">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2 text-slate-800">
                Study Materials
              </h3>
              <p className="text-gray-600 text-center text-sm">
                Access notes and resources
              </p>
            </Link>

            {/* Roadmaps Card */}
            <Link
              to="/roadmaps"
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 mb-4 mx-auto">
                <Layout className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2 text-slate-800">
                Learning Roadmaps
              </h3>
              <p className="text-gray-600 text-center text-sm">
                Follow structured learning paths
              </p>
            </Link>
          </div>
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
