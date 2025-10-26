import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, ArrowLeft, Sparkles } from 'lucide-react';
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
      'Explore Python libraries like NumPy, Pandas, and Matplotlib for data analysis.',
    category: 'data',
    difficulty: 'Intermediate',
    duration: '5 weeks',
    modules_count: 10,
    pdfUrl: 'https://example.com/python-data-science.pdf',
  },
  {
    id: 4,
    title: 'Machine Learning Basics',
    description:
      'Introduction to machine learning algorithms and their practical applications.',
    category: 'data',
    difficulty: 'Intermediate',
    duration: '8 weeks',
    modules_count: 15,
    pdfUrl: 'https://example.com/ml-basics.pdf',
  },
  {
    id: 5,
    title: 'UI/UX Design Principles',
    description: 'Learn the core principles of user interface and user experience design.',
    category: 'design',
    difficulty: 'Beginner',
    duration: '3 weeks',
    modules_count: 6,
    pdfUrl: 'https://example.com/uiux-design.pdf',
  },
];

const CoursesPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState(HARDCODED_COURSES);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      // Simulating an API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCourses(HARDCODED_COURSES);
    } catch (error) {
      toast.error('Failed to fetch courses');
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (course) => {
    if (course.pdfUrl) {
      window.open(course.pdfUrl, '_blank');
      toast.success(`Opening ${course.title}`);
    } else {
      toast.error('PDF not available for this course');
    }
  };

  const filteredCourses =
    selectedCategory === 'all'
      ? courses
      : courses.filter((course) => course.category === selectedCategory);

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Beginner: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      Intermediate: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      Advanced: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    };
    return colors[difficulty] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800/50 bg-black/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Course Library
                </h1>
                <p className="text-sm text-gray-400">Expand your knowledge</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Tabs */}
        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={(value) => setSelectedCategory(value)}
        >
          <TabsList className="bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm mb-8">
            <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600">
              All Courses
            </TabsTrigger>
            <TabsTrigger value="coding" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600">
              Coding
            </TabsTrigger>
            <TabsTrigger value="data" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600">
              Data Science
            </TabsTrigger>
            <TabsTrigger value="design" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600">
              Design
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="group relative bg-gradient-to-br from-gray-800/50 via-gray-800/30 to-gray-900/50 border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer backdrop-blur-sm"
                    onClick={() => handleCourseClick(course)}
                  >
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-blue-600/5 group-hover:via-purple-600/5 group-hover:to-pink-600/5 rounded-xl transition-all duration-300"></div>

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30">
                          <BookOpen className="h-6 w-6 text-blue-400" />
                        </div>
                        <Badge className={`${getDifficultyColor(course.difficulty)} border`}>
                          {course.difficulty}
                        </Badge>
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                        {course.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Sparkles className="h-4 w-4" />
                            <span>{course.modules_count} modules</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-xl"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 border border-gray-700/50 mb-4">
                  <BookOpen className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-300">No courses found</h3>
                <p className="text-gray-500">Try selecting a different category</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CoursesPage;
