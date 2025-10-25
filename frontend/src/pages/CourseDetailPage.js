import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, BookOpen, ArrowLeft, CheckCircle2, Circle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CourseDetailPage = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const courseRes = await axios.get(`${API}/courses/${id}`);
      setCourse(courseRes.data);

      const modulesRes = await axios.get(`${API}/courses/${id}/modules`);
      setModules(modulesRes.data);

      if (user && token) {
        try {
          const enrollmentsRes = await axios.get(`${API}/enrollments/my`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const userEnrollment = enrollmentsRes.data.find(e => e.course_id === id);
          setEnrollment(userEnrollment);

          if (userEnrollment) {
            const progressRes = await axios.get(`${API}/progress/course/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setProgress(progressRes.data);
          }
        } catch (error) {
          console.error('Error fetching enrollment:', error);
        }
      }
    } catch (error) {
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please login to enroll');
      navigate('/login');
      return;
    }

    // Check if course requires terms acceptance
    if (course.requires_terms) {
      setShowTermsDialog(true);
      return;
    }

    // Proceed with enrollment
    await enrollInCourse(false);
  };

  const enrollInCourse = async (withTerms = false) => {
    setEnrolling(true);
    try {
      await axios.post(
        `${API}/enrollments`,
        { 
          course_id: id,
          terms_accepted: withTerms
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Enrolled successfully!');
      setShowTermsDialog(false);
      setTermsAccepted(false);
      fetchCourseData();
    } catch (error) {
      if (error.response?.status === 400) {
        if (error.response.data.detail.includes('Terms')) {
          toast.error('You must accept the terms and conditions');
        } else {
          toast.info('Already enrolled in this course');
        }
      } else {
        toast.error('Failed to enroll');
      }
    } finally {
      setEnrolling(false);
    }
  };

  const handleModuleComplete = async (moduleId, completed) => {
    try {
      await axios.put(
        `${API}/progress`,
        { module_id: moduleId, course_id: id, completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCourseData();
      toast.success(completed ? 'Module marked as complete!' : 'Module unmarked');
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const isModuleCompleted = (moduleId) => {
    return progress.some(p => p.module_id === moduleId && p.completed);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-xl font-medium text-slate-600">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-xl font-medium text-slate-600">Course not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to={user ? "/dashboard" : "/"} className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            DexNote
          </Link>
          <div className="flex gap-4">
            <Link to="/courses">
              <Button variant="ghost" data-testid="nav-courses-btn">All Courses</Button>
            </Link>
            {user && (
              <Link to="/dashboard">
                <Button variant="outline" data-testid="nav-dashboard-btn">Dashboard</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/courses" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors" data-testid="back-to-courses-link">
            <ArrowLeft className="w-4 h-4" />
            Back to courses
          </Link>

          <div className="flex items-start gap-3 mb-4">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
              {course.difficulty}
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
              {course.category}
            </span>
          </div>

          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }} data-testid="course-title">
            {course.title}
          </h1>
          <p className="text-xl text-white/90 mb-6 max-w-3xl">{course.description}</p>

          <div className="flex items-center gap-6 text-white/90">
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {course.duration}
            </span>
            <span className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {course.modules_count} modules
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Modules */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Course Content
            </h2>

            {modules.length === 0 ? (
              <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-slate-200 text-center">
                <p className="text-slate-600">No modules available yet</p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4" data-testid="course-modules">
                {modules.map((module, index) => (
                  <AccordionItem
                    key={module.id}
                    value={module.id}
                    className="bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl overflow-hidden"
                    data-testid={`module-${module.id}`}
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-white/40">
                      <div className="flex items-center gap-4 w-full">
                        {enrollment && isModuleCompleted(module.id) ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" data-testid={`completed-icon-${module.id}`} />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-400" />
                        )}
                        <div className="flex-1 text-left">
                          <div className="font-bold text-slate-900">
                            Module {index + 1}: {module.title}
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 bg-white/40">
                      <div className="prose prose-slate max-w-none mb-4">
                        <p className="text-slate-700 whitespace-pre-wrap">{module.content}</p>
                      </div>
                      {enrollment && (
                        <Button
                          onClick={() => handleModuleComplete(module.id, !isModuleCompleted(module.id))}
                          variant={isModuleCompleted(module.id) ? "outline" : "default"}
                          className={!isModuleCompleted(module.id) ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700" : ""}
                          data-testid={`complete-btn-${module.id}`}
                        >
                          {isModuleCompleted(module.id) ? 'Mark as Incomplete' : 'Mark as Complete'}
                        </Button>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 sticky top-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Your Progress</h3>

              {enrollment ? (
                <div>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-600">Completion</span>
                      <span className="font-bold text-slate-900" data-testid="enrollment-progress">{Math.round(enrollment.progress)}%</span>
                    </div>
                    <Progress value={enrollment.progress} className="h-3" />
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Modules</span>
                      <span className="font-medium text-slate-900">{modules.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Completed</span>
                      <span className="font-medium text-slate-900">{progress.filter(p => p.completed).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Remaining</span>
                      <span className="font-medium text-slate-900">{modules.length - progress.filter(p => p.completed).length}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-slate-600 mb-6">Enroll in this course to start learning and track your progress.</p>
                  <Button
                    onClick={handleEnroll}
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700"
                    data-testid="enroll-course-btn"
                  >
                    Enroll Now
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
