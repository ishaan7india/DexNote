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
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-teal-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
            Smart Notes, Smarter Learning
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Transform your study experience with AI-powered note-taking, interactive courses, and collaborative tools.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all">
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-800">
            Everything You Need to Excel
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Brain className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800">AI-Powered Tools</h3>
              <p className="text-slate-600">Leverage cutting-edge AI to enhance your learning with smart summaries and insights.</p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800">Interactive Courses</h3>
              <p className="text-slate-600">Access curated courses designed to help you master any subject efficiently.</p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Code className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800">Smart Note-Taking</h3>
              <p className="text-slate-600">Organize your thoughts with powerful markdown support and real-time collaboration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="flex items-center justify-center mb-3">
                <Users className="text-blue-600" size={32} />
              </div>
              <div className="text-4xl font-bold text-slate-800 mb-2">10K+</div>
              <div className="text-slate-600">Active Students</div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center mb-3">
                <Award className="text-teal-600" size={32} />
              </div>
              <div className="text-4xl font-bold text-slate-800 mb-2">50+</div>
              <div className="text-slate-600">Expert Courses</div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="text-purple-600" size={32} />
              </div>
              <div className="text-4xl font-bold text-slate-800 mb-2">95%</div>
              <div className="text-slate-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of students who are already achieving more with DexNote.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all">
              Start Your Journey Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            DexNote
          </div>
          <p className="text-slate-400 mb-6">
            Empowering students with intelligent learning tools.
          </p>
          <div className="flex gap-6 justify-center text-slate-400">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="mt-8 text-slate-500 text-sm">
            © 2024 DexNote. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
