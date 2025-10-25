import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios'; // Commented out - not using backend
// import { AuthContext } from '../App'; // Commented out - not using auth
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, BookOpen, FileText, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

// Hardcoded courses with PDF links
const HARDCODED_COURSES = [
  {
    id: 1,
    title: 'Introduction to React',
    description: 'Learn the fundamentals of React including components, state, props, and hooks.',
    category: 'coding',
    difficulty: 'Beginner',
    duration: '4 weeks',
    modules_count: 8,
    pdfUrl: 'https://example.com/react-intro.pdf'
  },
  {
    id: 2,
    title: 'Advanced JavaScript',
    description: 'Master advanced JavaScript concepts like closures, promises, async/await, and more.',
    category: 'coding',
    difficulty: 'Advanced',
    duration: '6 weeks',
    modules_count: 12,
    pdfUrl: 'https://example.com/advanced-js.pdf'
  },
  {
    id: 3,
    title: 'Python for Data Science',
    description: 'Learn Python programming with focus on data analysis, pandas, and numpy.',
    category: 'coding',
    difficulty: 'Intermediate',
    duration: '5 weeks',
    modules_count: 10,
    pdfUrl: 'https://example.com/python-ds.pdf'
  },
  {
    id: 4,
    title: 'ChatGPT Mastery',
    description: 'Learn how to effectively use ChatGPT for productivity, content creation, and problem solving.',
    category: 'ai-tools',
    difficulty: 'Beginner',
    duration: '3 weeks',
    modules_count: 6,
    pdfUrl: 'https://example.com/chatgpt-mastery.pdf'
  },
  {
    id: 5,
    title: 'Midjourney AI Art',
    description: 'Create stunning AI-generated artwork using Midjourney and master prompt engineering.',
    category: 'ai-tools',
    difficulty: 'Beginner',
    duration: '2 weeks',
    modules_count: 5,
    pdfUrl: 'https://example.com/midjourney.pdf'
  },
  {
    id: 6,
    title: 'Linear Algebra',
    description: 'Comprehensive guide to linear algebra including vectors, matrices, and transformations.',
    category: 'mathematics',
    difficulty: 'Intermediate',
    duration: '8 weeks',
    modules_count: 15,
    pdfUrl: 'https://example.com/linear-algebra.pdf'
  },
  {
    id: 7,
    title: 'Calculus Fundamentals',
    description: 'Master calculus concepts including limits, derivatives, and integrals.',
    category: 'mathematics',
    difficulty: 'Intermediate',
    duration: '10 weeks',
    modules_count: 18,
    pdfUrl: 'https://example.com/calculus.pdf'
  },
  {
    id: 8,
    title: 'Statistics and Probability',
    description: 'Learn statistical methods, probability theory, and data analysis techniques.',
    category: 'mathematics',
    difficulty: 'Beginner',
    duration: '6 weeks',
    modules_count: 12,
    pdfUrl: 'https://example.com/statistics.pdf'
  },
  {
    id: 9,
    title: 'Node.js Backend Development',
    description: 'Build robust backend applications with Node.js, Express, and MongoDB.',
    category: 'coding',
    difficulty: 'Intermediate',
    duration: '7 weeks',
    modules_count: 14,
    pdfUrl: 'https://example.com/nodejs.pdf'
  }
];

const CoursesPage = () => {
  // const { user, token } = useContext(AuthContext); // Commented out - not using auth
  const [courses] = useState(HARDCODED_COURSES);
  const [completedCourses, setCompletedCourses] = useState({});
  const navigate = useNavigate();

  // Load completed courses from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('completedCourses');
    if (stored) {
      setCompletedCourses(JSON.parse(stored));
    }
  }, []);

  // Commented out - not using backend API
  // const fetchCourses = async () => {
  //   try {
  //     const response = await axios.get(`${API}/courses`);
  //     setCourses(response.data);
  //   } catch (error) {
  //     toast.error('Failed to load courses');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleMarkComplete = (courseId, e) => {
    e.stopPropagation();
    const newCompleted = { ...completedCourses, [courseId]: !completedCourses[courseId] };
    setCompletedCourses(newCompleted);
    localStorage.setItem('completedCourses', JSON.stringify(newCompleted));
    toast.success(newCompleted[courseId] ? 'Marked as complete!' : 'Unmarked as complete');
  };

  const handleOpenPDF = (pdfUrl, e) => {
    e.stopPropagation();
    window.open(pdfUrl, '_blank');
  };

  const filteredCourses = (category) => {
    if (category === 'all') return courses;
    return courses.filter(c => c.category === category);
  };

  const CourseCard = ({ course }) => (
    <div
      className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1"
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
          {completedCourses[course.id] && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Completed
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{course.title}</h3>
        <p className="text-slate-600 mb-4 line-clamp-3">{course.description}</p>
      </div>

      <div className="flex items-center justify-between mb-4">
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

      <div className="flex gap-2">
        <Button
          className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700"
          onClick={(e) => handleOpenPDF(course.pdfUrl, e)}
          data-testid={`pdf-btn-${course.id}`}
        >
          <FileText className="w-4 h-4 mr-2" />
          Open PDF
        </Button>
        <Button
          className={completedCourses[course.id] ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-slate-200 hover:bg-slate-300'}
          onClick={(e) => handleMarkComplete(course.id, e)}
          data-testid={`complete-btn-${course.id}`}
        >
          <CheckCircle className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            DexNote
          </Link>
          <div className="flex gap-4">
            <Link to="/ai-tools">
              <Button variant="ghost" data-testid="nav-ai-tools-btn">AI Tools</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-800 to-teal-700 bg-clip-text text-transparent" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Resource Library
          </h1>
          <p className="text-xl text-slate-600">Browse our comprehensive catalog of learning resources</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8" data-testid="course-tabs">
            <TabsTrigger value="all" data-testid="tab-all">All Courses</TabsTrigger>
            <TabsTrigger value="coding" data-testid="tab-coding">Coding</TabsTrigger>
            <TabsTrigger value="ai-tools" data-testid="tab-ai-tools">AI Tools</TabsTrigger>
            <TabsTrigger value="mathematics" data-testid="tab-mathematics">Mathematics</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid md:grid-cols-3 gap-6" data-testid="all-courses-grid">
              {filteredCourses('all').map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
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

          <TabsContent value="mathematics">
            <div className="grid md:grid-cols-3 gap-6" data-testid="mathematics-courses-grid">
              {filteredCourses('mathematics').map(course => (
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
