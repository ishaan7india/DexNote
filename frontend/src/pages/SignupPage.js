import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/signup`, { username, email, password });
      login(response.data.token, response.data.user);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors" data-testid="back-to-home-link">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
        
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-slate-200 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Create Account
            </h1>
            <p className="text-slate-600">Start your learning journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-slate-700">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="johndoe"
                className="mt-2"
                data-testid="signup-username-input"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-slate-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="mt-2"
                data-testid="signup-email-input"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-700">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="mt-2"
                data-testid="signup-password-input"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700"
              data-testid="signup-submit-btn"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium" data-testid="login-link">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
