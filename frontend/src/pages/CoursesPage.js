import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, BookOpen, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CoursesPage = () => {
  const { user, token } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API}/courses`);
      setCourses(response.data);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId, e) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to enroll');
      navigate('/login');
      return;
    }

    setEnrolling(courseId);
    try {
      await axios.post(
        `${API}/enrollments`,
        { course_id: courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Enrolled successfully!');
      navigate('/dashboard');
    } catch (error) {
      if (error.response?.status === 400) {
        toast.info('Already enrolled in this course');
        navigate(`/courses/${courseId}`);
      } else {
        toast.error('Failed to enroll');
      }
    } finally {
      setEnrolling(null);
    }
  };

  const filteredCourses = (category) => {
    if (category === 'all') return courses;
    return courses.filter(c => c.category === category);
  };

  const CourseCard = ({ course }) => (
    <div
      className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
      onClick={() => navigate(`/courses/${course.id}`)}
      data-testid={`course-card-${course.id}`}
    >
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
            {course.difficulty}
          </span>
          <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-lg text-xs font-medium">
            {course.category}
          </span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{course.title}</h3>
        <p className="text-slate-600 mb-4 line-clamp-3">{course.description}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {course.modules_count} modules
          </span>
        </div>
      </div>

      <Button
        className="w-full mt-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700"
        onClick={(e) => handleEnroll(course.id, e)}
        disabled={enrolling === course.id}
        data-testid={`enroll-btn-${course.id}`}
      >
        {enrolling === course.id ? 'Enrolling...' : 'Enroll Now'}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to={user ? "/dashboard" : "/"} className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            DexNote
          </Link>
          <div className="flex gap-4">
            <Link to="/ai-tools">
              <Button variant="ghost" data-testid="nav-ai-tools-btn">AI Tools</Button>
            </Link>
            {user ? (
              <Link to="/dashboard">
                <Button variant="outline" data-testid="nav-dashboard-btn">Dashboard</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button data-testid="nav-login-btn" className="bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-800 to-teal-700 bg-clip-text text-transparent" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            All Courses
          </h1>
          <p className="text-xl text-slate-600">Choose from our comprehensive catalog of courses</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8" data-testid="course-tabs">
            <TabsTrigger value="all" data-testid="tab-all">All Courses</TabsTrigger>
            <TabsTrigger value="coding" data-testid="tab-coding">Coding</TabsTrigger>
            <TabsTrigger value="ai-tools" data-testid="tab-ai-tools">AI Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {loading ? (
              <div className="text-center py-12 text-slate-600">Loading courses...</div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6" data-testid="all-courses-grid">
                {filteredCourses('all').map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="coding">
            <div className="grid md:grid-cols-3 gap-6" data-testid="coding-courses-grid">
              {filteredCourses('coding').map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai-tools">
            <div className="grid md:grid-cols-3 gap-6" data-testid="ai-tools-courses-grid">
              {filteredCourses('ai-tools').map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CoursesPage;
