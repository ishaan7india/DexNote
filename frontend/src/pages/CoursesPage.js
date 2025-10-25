import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, BookOpen, FileText, CheckCircle } from 'lucide-react';
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

const markSignedUp = () => localStorage.setItem('dexnote_signed_up', 'true');
const markLoggedIn = () => localStorage.setItem('dexnote_logged_in', 'true');

function AuthPrompt({ onSignup, onLogin }) {
  return (
    <div className="w-full max-w-xl mx-auto p-6 border rounded-lg shadow-sm text-center">
      <h2 className="text-2xl font-semibold mb-2">Create an account to continue</h2>
      <p className="text-muted-foreground mb-6">
        Sign up or log in to access course PDFs and mark lessons as complete.
      </p>
      <div className="flex gap-3 justify-center">
        <Button onClick={onSignup} data-testid="auth-signup-btn">Sign up</Button>
        <Button variant="secondary" onClick={onLogin} data-testid="auth-login-btn">Log in</Button>
      </div>
    </div>
  );
}

function CourseCard({ course, canAccess, onRequireAuth, onMarkComplete }) {
  const handleOpenPdf = () => {
    if (!canAccess) return onRequireAuth();
    window.open(course.pdfUrl, '_blank', 'noopener');
  };

  const handleComplete = () => {
    if (!canAccess) return onRequireAuth();
    onMarkComplete(course.id);
  };

  return (
    <div className="border rounded-lg p-4 space-y-3" data-testid={`course-card-${course.id}`}>
      <div className="flex items-center gap-2">
        <BookOpen size={18} />
        <h3 className="font-semibold text-lg">{course.title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{course.description}</p>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Clock size={14} /> {course.duration}</span>
        <span>{course.difficulty}</span>
        <span>{course.modules_count} modules</span>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleOpenPdf} data-testid={`open-pdf-${course.id}`}>
          <FileText className="mr-2" size={16} /> View PDF
        </Button>
        <Button size="sm" variant="secondary" onClick={handleComplete} data-testid={`complete-${course.id}`}>
          <CheckCircle className="mr-2" size={16} /> Mark as Complete
        </Button>
      </div>
      {!canAccess && (
        <p className="text-xs text-amber-600" data-testid={`restricted-${course.id}`}>
          Restricted: Please sign up or log in to access.
        </p>
      )}
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

  const requireAuth = () => {
    toast.error('Please sign up or log in to continue');
  };

  const handleSignup = () => {
    markSignedUp();
    markLoggedIn();
    setAuthed(true);
    toast.success('Signed up successfully!');
  };

  const handleLogin = () => {
    markLoggedIn();
    if (!isSignedUp()) markSignedUp();
    setAuthed(true);
    toast.success('Logged in successfully!');
  };

  const filteredCourses = (category) =>
    (category === 'all'
      ? HARDCODED_COURSES
      : HARDCODED_COURSES.filter((c) => c.category === category));

  const onMarkComplete = (id) => {
    const updated = { ...completed, [id]: true };
    setCompleted(updated);
    localStorage.setItem('dexnote_completed', JSON.stringify(updated));
    toast.success('Marked as complete');
  };

  if (!authed) {
    return (
      <div className="container py-8">
        <AuthPrompt onSignup={handleSignup} onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Courses</h1>
        <p className="text-muted-foreground">Browse available courses and track progress.</p>
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
            {filteredCourses('all').map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                canAccess={authed}
                onRequireAuth={requireAuth}
                onMarkComplete={onMarkComplete}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="coding">
          <div className="grid md:grid-cols-3 gap-6" data-testid="coding-courses-grid">
            {filteredCourses('coding').map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                canAccess={authed}
                onRequireAuth={requireAuth}
                onMarkComplete={onMarkComplete}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-tools">
          <div className="grid md:grid-cols-3 gap-6" data-testid="ai-tools-courses-grid">
            {filteredCourses('ai-tools').map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                canAccess={authed}
                onRequireAuth={requireAuth}
                onMarkComplete={onMarkComplete}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mathematics">
          <div className="grid md:grid-cols-3 gap-6" data-testid="mathematics-courses-grid">
            {filteredCourses('mathematics').map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                canAccess={authed}
                onRequireAuth={requireAuth}
                onMarkComplete={onMarkComplete}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
