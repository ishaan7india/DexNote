import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, BookOpen, FileText, CheckCircle, Home, Book, Presentation } from 'lucide-react';
import { toast } from 'sonner';

// Hardcoded courses with PDF links
const HARDCODED_COURSES = [
  {
    id: 1,
    title: 'Introduction to React',
    description:
      'Learn the fundamentals of React including components, state, props, and hooks.',
    category: 'coding',
    difficulty: 'Beginner',
    duration: '4 weeks',
    modules_count: 8,
    pdfUrl: 'https://example.com/react-intro.pdf',
  },
  {
    id: 2,
    title: 'Advanced JavaScript',
    description:
      'Master advanced JavaScript concepts like closures, promises, async/await, and more.',
    category: 'coding',
    difficulty: 'Advanced',
    duration: '6 weeks',
    modules_count: 12,
    pdfUrl: 'https://example.com/advanced-js.pdf',
  },
  {
    id: 3,
    title: 'Python for Data Science',
    description:
      'Learn Python programming with focus on data analysis, pandas, and numpy.',
    category: 'coding',
    difficulty: 'Intermediate',
    duration: '5 weeks',
    modules_count: 10,
    pdfUrl: 'https://example.com/python-ds.pdf',
  },
];

// Helpers for auth state in localStorage
const isSignedUp = () => localStorage.getItem('dexnote_signed_up') === 'true';
const isLoggedIn = () => localStorage.getItem('dexnote_logged_in') === 'true';

// Navigation component with links to Courses, Notes, and Whiteboard
function Navigation() {
  return (
    <nav className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 py-4 px-6 mb-8 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">DexNote</h2>
        <div className="flex gap-6">
          <Link
            to="/courses"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <Book size={18} />
            Courses
          </Link>
          <Link
            to="/notes"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 transition-colors font-medium shadow-sm"
          >
            <FileText size={18} />
            Notes
          </Link>
          <Link
            to="/whiteboard"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 transition-colors font-medium shadow-sm"
          >
            <Presentation size={18} />
            Whiteboard
          </Link>
        </div>
      </div>
    </nav>
  );
}

function CourseCard({ course, canAccess, onMarkComplete }) {
  const handleOpenPdf = () => {
    if (!canAccess) return;
    window.open(course.pdfUrl, '_blank', 'noopener');
  };

  const handleComplete = () => {
    if (!canAccess) return;
    onMarkComplete(course.id);
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      data-testid={`course-card-${course.id}`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <BookOpen size={24} className="text-blue-600" />
        </div>
        <h3 className="font-bold text-xl text-gray-800">{course.title}</h3>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span className="inline-flex items-center gap-1">
          <Clock size={16} className="text-blue-500" /> {course.duration}
        </span>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
          {course.difficulty}
        </span>
        <span className="text-gray-600">{course.modules_count} modules</span>
      </div>
      <div className="flex gap-3 pt-2">
        <Button
          data-testid={`open-pdf-${course.id}`}
          onClick={handleOpenPdf}
          size="sm"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
        >
          <FileText className="mr-2" size={16} /> View PDF
        </Button>
        <Button
          data-testid={`complete-${course.id}`}
          onClick={handleComplete}
          size="sm"
          variant="secondary"
          className="flex-1 border-2 border-green-500 text-green-700 hover:bg-green-50 font-medium"
        >
          <CheckCircle className="mr-2" size={16} /> Mark Complete
        </Button>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [completed, setCompleted] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dexnote_completed') || '{}');
    } catch {
      return {};
    }
  });

  useEffect(() => {
    setAuthed(isSignedUp() && isLoggedIn());
  }, []);

  const filteredCourses = (category) =>
    category === 'all'
      ? HARDCODED_COURSES
      : HARDCODED_COURSES.filter((c) => c.category === category);

  const onMarkComplete = (id) => {
    const updated = { ...completed, [id]: true };
    setCompleted(updated);
    localStorage.setItem('dexnote_completed', JSON.stringify(updated));
    toast.success('Marked as complete');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">Explore Courses</h1>
          <p className="text-lg text-gray-600">Browse available courses and track your progress</p>
        </div>
        <Tabs className="w-full" defaultValue="all">
          <TabsList className="mb-10 flex justify-center bg-white shadow-md rounded-xl p-2" data-testid="course-tabs">
            <TabsTrigger
              data-testid="tab-all"
              value="all"
              className="px-6 py-3 text-base font-semibold rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
            >
              All Courses
            </TabsTrigger>
            <TabsTrigger
              data-testid="tab-coding"
              value="coding"
              className="px-6 py-3 text-base font-semibold rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
            >
              Coding
            </TabsTrigger>
            <TabsTrigger
              data-testid="tab-ai-tools"
              value="ai-tools"
              className="px-6 py-3 text-base font-semibold rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
            >
              AI Tools
            </TabsTrigger>
            <TabsTrigger
              data-testid="tab-mathematics"
              value="mathematics"
              className="px-6 py-3 text-base font-semibold rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
            >
              Mathematics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
              data-testid="all-courses-grid"
            >
              {filteredCourses('all').map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  canAccess={authed}
                  onMarkComplete={onMarkComplete}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="coding">
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
              data-testid="coding-courses-grid"
            >
              {filteredCourses('coding').map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  canAccess={authed}
                  onMarkComplete={onMarkComplete}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="ai-tools">
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
              data-testid="ai-tools-courses-grid"
            >
              {filteredCourses('ai-tools').map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  canAccess={authed}
                  onMarkComplete={onMarkComplete}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="mathematics">
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
              data-testid="mathematics-courses-grid"
            >
              {filteredCourses('mathematics').map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  canAccess={authed}
                  onMarkComplete={onMarkComplete}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
