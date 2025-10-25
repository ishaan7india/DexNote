import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Code, Brain, BookOpen, Users, Award, TrendingUp } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full backdrop-blur-md bg-white/70 border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            DexNote
          </div>
          <div className="flex gap-4">
            <Link to="/courses">
              <Button variant="ghost" data-testid="nav-courses-btn">Courses</Button>
            </Link>
            <Link to="/ai-tools">
              <Button variant="ghost" data-testid="nav-ai-tools-btn">AI Tools</Button>
            </Link>
            <Link to="/notes">
              <Button variant="ghost" data-testid="nav-notes-btn">Notes</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" data-testid="nav-login-btn">Login</Button>
            </Link>
            <Link to="/signup">
              <Button data-testid="nav-signup-btn" className="bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-teal-700 bg-clip-text text-transparent" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Master Coding & AI Tools
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Join DexNote's comprehensive learning platform. Build real-world skills with hands-on courses and cutting-edge AI tools.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 text-lg px-8 py-6">
                Get Started Free
              </Button>
            </Link>
            <Link to="/courses">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Explore Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Why Choose DexNote?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1" data-testid="feature-coding-courses">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center mb-6">
                <Code className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Coding Courses</h3>
              <p className="text-slate-600">
                Learn programming from scratch or advance your skills with structured courses covering Python, JavaScript, and more.
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1" data-testid="feature-ai-tools">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">AI Tools</h3>
              <p className="text-slate-600">
                Discover and master the latest AI tools that are transforming how we code, create, and innovate.
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1" data-testid="feature-progress-tracking">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Progress Tracking</h3>
              <p className="text-slate-600">
                Track your learning journey with detailed progress metrics and personalized dashboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center text-white">
            <div data-testid="stat-courses">
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-blue-100 text-lg">Expert-Led Courses</div>
            </div>
            <div data-testid="stat-students">
              <div className="text-5xl font-bold mb-2">10k+</div>
              <div className="text-blue-100 text-lg">Active Learners</div>
            </div>
            <div data-testid="stat-completion">
              <div className="text-5xl font-bold mb-2">95%</div>
              <div className="text-blue-100 text-lg">Completion Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-slate-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            Join thousands of learners mastering coding and AI tools on DexNote.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 text-lg px-10 py-6">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            DexNote
          </div>
          <p className="text-slate-400 mb-6">Empowering learners worldwide with cutting-edge education.</p>
          <div className="flex justify-center gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
