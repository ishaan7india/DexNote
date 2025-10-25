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
      'Learn Python programming with focus on data analysis, pandas, and numpy.',
    category: 'coding',
    difficulty: 'Intermediate',
    duration: '8 weeks',
    modules_count: 16,
    pdfUrl: 'https://example.com/python-data-science.pdf',
  },
  {
    id: 4,
    title: 'Machine Learning Basics',
    description:
      'Get started with machine learning algorithms and techniques.',
    category: 'ai',
    difficulty: 'Intermediate',
    duration: '10 weeks',
    modules_count: 20,
    pdfUrl: 'https://example.com/ml-basics.pdf',
  },
  {
    id: 5,
    title: 'Linear Algebra',
    description:
      'Master the mathematical foundations essential for data science and ML.',
    category: 'mathematics',
    difficulty: 'Intermediate',
    duration: '6 weeks',
    modules_count: 10,
    pdfUrl: 'https://example.com/linear-algebra.pdf',
  },
  {
    id: 6,
    title: 'Deep Learning Fundamentals',
    description:
      'Dive into neural networks, CNNs, RNNs, and modern deep learning architectures.',
    category: 'ai',
    difficulty: 'Advanced',
    duration: '12 weeks',
    modules_count: 24,
    pdfUrl: 'https://example.com/deep-learning.pdf',
  },
];

const CourseCard = ({ course }) => {
  const getCategoryColor = (category) => {
    const colors = {
      coding: 'from-blue-600 to-blue-700',
      ai: 'from-purple-600 to-purple-700',
      mathematics: 'from-teal-600 to-teal-700',
    };
    return colors[category] || 'from-gray-600 to-gray-700';
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      coding: 'bg-blue-100 text-blue-700',
      ai: 'bg-purple-100 text-purple-700',
      mathematics: 'bg-teal-100 text-teal-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Link to={`/courses/${course.id}`} className="group">
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-16 h-16 bg-gradient-to-br ${getCategoryColor(course.category)} rounded-2xl flex items-center justify-center`}>
            <BookOpen className="text-white" size={32} />
          </div>
          <Badge className={getCategoryBadgeColor(course.category)}>
            {course.category.charAt(0).toUpperCase() + course.category.slice(1)}
          </Badge>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Sparkles className="text-blue-600" size={16} />
            <span>{course.modules_count} modules</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock className="text-teal-600" size={16} />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Sparkles className="text-purple-600" size={16} />
            <span>{course.difficulty}</span>
          </div>
        </div>
        <Button className={`w-full bg-gradient-to-r ${getCategoryColor(course.category)} text-white hover:opacity-90`}>
          View Course
        </Button>
      </div>
    </Link>
  );
};

const CoursesPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredCourses =
    selectedCategory === 'all'
      ? HARDCODED_COURSES
      : HARDCODED_COURSES.filter((course) => course.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full backdrop-blur-md bg-white/70 border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Dashboard</span>
          </button>
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            DexNote Courses
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 via-teal-600 to-purple-600 rounded-2xl mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Explore Our Courses
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Discover a wide range of courses designed to help you master new skills and achieve your learning goals.
          </p>
        </div>
      </div>

      {/* Courses Section */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8 flex justify-center bg-white/60 backdrop-blur-sm p-2 rounded-2xl border border-slate-200">
            <TabsTrigger
              value="all"
              onClick={() => setSelectedCategory('all')}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-teal-600 data-[state=active]:text-white"
            >
              All Courses
            </TabsTrigger>
            <TabsTrigger
              value="coding"
              onClick={() => setSelectedCategory('coding')}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white"
            >
              Coding
            </TabsTrigger>
            <TabsTrigger
              value="ai"
              onClick={() => setSelectedCategory('ai')}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white"
            >
              AI Tools
            </TabsTrigger>
            <TabsTrigger
              value="mathematics"
              onClick={() => setSelectedCategory('mathematics')}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-teal-700 data-[state=active]:text-white"
            >
              Mathematics
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">No courses found in this category.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-white/90 text-lg mb-6">
            We're constantly adding new courses. Check back soon or request a course topic!
          </p>
          <Button
            onClick={() => navigate('/dashboard')}
            size="lg"
            className="bg-white text-blue-600 hover:bg-slate-100"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
