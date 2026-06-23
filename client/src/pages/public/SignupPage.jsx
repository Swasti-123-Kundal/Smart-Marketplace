import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, ChevronRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const SignupPage = () => {
  const [role, setRole] = useState('freelancer'); // Default role
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { register, isAuthenticated, user, error, loading, resetError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    resetError();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'client') {
        navigate('/client');
      } else {
        navigate('/freelancer');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !role) return;
    register({ name, email, password, role });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent-500/10 blur-[120px]" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
            WorkSphere
          </Link>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Create an account to begin your journey
          </p>
        </div>

        <Card className="backdrop-blur-xl">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Role Selection Tabs */}
          <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
            <button
              type="button"
              onClick={() => setRole('freelancer')}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all
                ${role === 'freelancer'
                  ? 'bg-white dark:bg-slate-800 text-primary-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-950 dark:hover:text-slate-50'
                }
              `}
            >
              <Briefcase size={16} />
              As Freelancer
            </button>
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all
                ${role === 'client'
                  ? 'bg-white dark:bg-slate-800 text-primary-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-950 dark:hover:text-slate-50'
                }
              `}
            >
              <User size={16} />
              As Client
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Full Name"
              id="name"
              type="text"
              placeholder="John Doe"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              id="email"
              type="email"
              placeholder="name@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              id="password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full py-3"
              icon={ChevronRight}
              iconPosition="right"
            >
              Sign Up
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:underline">
              Sign In
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
