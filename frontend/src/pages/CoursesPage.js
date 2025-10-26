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
      Beginner: 'bg-green-100 text-green-700 border-green-300',
      Intermediate: 'bg-blue-100 text-blue-700 border-blue-300',
      Advanced: 'bg-purple-100 text-purple-700 border-purple-300',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Course Library
                </h1>
                <p className="text-sm text-gray-600">Expand your knowledge</p>
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
          <TabsList className="bg-gray-100 border border-gray-200 backdrop-blur-sm mb-8">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              All Courses
            </TabsTrigger>
            <TabsTrigger
              value="coding"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              Coding
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              Data Science
            </TabsTrigger>
            <TabsTrigger
              value="design"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
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
                    className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => handleCourseClick(course)}
                  >
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/30 group-hover:via-purple-50/30 group-hover:to-pink-50/30 rounded-xl transition-all duration-300"></div>

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg border border-blue-200">
                          <BookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                        <Badge
                          className={`${getDifficultyColor(course.difficulty)} border`}
                        >
                          {course.difficulty}
                        </Badge>
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-all duration-300">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
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
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-200/20 via-purple-200/20 to-pink-200/20 blur-xl"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 border border-gray-200 mb-4">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">No courses found</h3>
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
