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
      'Explore data analysis, visualization, and machine learning with Python.',
    category: 'data',
    difficulty: 'Intermediate',
    duration: '8 weeks',
    modules_count: 16,
    pdfUrl: 'https://example.com/python-ds.pdf',
  },
  {
    id: 4,
    title: 'Machine Learning Fundamentals',
    description:
      'Introduction to machine learning algorithms, neural networks, and AI concepts.',
    category: 'data',
    difficulty: 'Advanced',
    duration: '10 weeks',
    modules_count: 20,
    pdfUrl: 'https://example.com/ml-fundamentals.pdf',
  },
  {
    id: 5,
    title: 'UI/UX Design Principles',
    description:
      'Learn user interface and user experience design best practices and tools.',
    category: 'design',
    difficulty: 'Beginner',
    duration: '5 weeks',
    modules_count: 10,
    pdfUrl: 'https://example.com/uiux-design.pdf',
  },
  {
    id: 6,
    title: 'Math for Grade 6-8',
    description:
      'Master middle school mathematics including fractions, decimals, percentages, basic algebra, geometry, and pre-algebra concepts.',
    category: 'math',
    difficulty: 'Beginner',
    duration: '12 weeks',
    modules_count: 24,
    pdfUrl: 'https://example.com/math-6-8.pdf',
  },
  {
    id: 7,
    title: 'Algebra I - Grade 9',
    description:
      'Comprehensive Algebra I course covering linear equations, inequalities, functions, polynomials, factoring, quadratic equations, and graphing.',
    category: 'math',
    difficulty: 'Intermediate',
    duration: '16 weeks',
    modules_count: 32,
    pdfUrl: 'https://example.com/algebra-1-grade9.pdf',
  },
  {
    id: 8,
    title: 'Geometry - Grade 10',
    description:
      'Complete geometry course including points, lines, angles, triangles, circles, polygons, transformations, proofs, and coordinate geometry.',
    category: 'math',
    difficulty: 'Intermediate',
    duration: '16 weeks',
    modules_count: 32,
    pdfUrl: 'https://example.com/geometry-grade10.pdf',
  },
  {
    id: 9,
    title: 'Algebra II - Grade 11',
    description:
      'Advanced algebra topics including exponential and logarithmic functions, rational expressions, conic sections, sequences, series, and probability.',
    category: 'math',
    difficulty: 'Advanced',
    duration: '16 weeks',
    modules_count: 32,
    pdfUrl: 'https://example.com/algebra-2-grade11.pdf',
  },
  {
    id: 10,
    title: 'Pre-Calculus - Grade 12',
    description:
      'Pre-calculus fundamentals covering trigonometry, complex numbers, vectors, matrices, polar coordinates, and limits to prepare for calculus.',
    category: 'math',
    difficulty: 'Advanced',
    duration: '16 weeks',
    modules_count: 32,
    pdfUrl: 'https://example.com/precalculus-grade12.pdf',
  },
];

const CoursesPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Use hardcoded courses
    setCourses(HARDCODED_COURSES);
  }, []);

  const filteredCourses =
    selectedCategory === 'all'
      ? courses
      : courses.filter((course) => course.category === selectedCategory);

  const handleCourseClick = (course) => {
    // Open PDF in a new tab if available
    if (course.pdfUrl) {
      window.open(course.pdfUrl, '_blank');
      toast.success(`Opening ${course.title}`);
    } else {
      toast.error('PDF not available for this course');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="hover:bg-blue-50 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Available Courses
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={(value) => setSelectedCategory(value)}
        >
          {/* Category Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-8">
            <TabsList className="w-full grid grid-cols-5 gap-2 bg-transparent">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg transition-all duration-300 hover:bg-gray-100"
              >
                All Courses
              </TabsTrigger>
              <TabsTrigger
                value="coding"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-lg transition-all duration-300 hover:bg-gray-100"
              >
                Coding
              </TabsTrigger>
              <TabsTrigger
                value="data"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg transition-all duration-300 hover:bg-gray-100"
              >
                Data Science
              </TabsTrigger>
              <TabsTrigger
                value="design"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white rounded-lg transition-all duration-300 hover:bg-gray-100"
              >
                Design
              </TabsTrigger>
              <TabsTrigger
                value="math"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white rounded-lg transition-all duration-300 hover:bg-gray-100"
              >
                Mathematics
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Course Grid */}
          <TabsContent value={selectedCategory} className="mt-0">
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => handleCourseClick(course)}
                    className="group relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300"
                  >
                    {/* Difficulty Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant="secondary"
                        className={`${
                          course.difficulty === 'Beginner'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : course.difficulty === 'Intermediate'
                            ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                            : 'bg-red-100 text-red-700 border-red-200'
                        } border`}
                      >
                        {course.difficulty}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="pt-2">
                      {/* Category Icon/Tag */}
                      <div className="mb-3">
                        <Badge
                          variant="outline"
                          className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-700 capitalize"
                        >
                          {course.category}
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
