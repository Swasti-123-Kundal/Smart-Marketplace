import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated, user, error, loading, resetError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    resetError();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
        return;
      }
      
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'client') {
        navigate('/client');
      } else {
        navigate('/freelancer');
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    login({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-500/10 blur-[120px]" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
            WorkSphere
          </Link>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Sign in to unlock your professional world
          </p>
        </div>

        <Card className="backdrop-blur-xl">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

            <div className="flex items-center justify-between text-xs font-semibold">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800" />
                Remember me
              </label>
              <a href="#" className="text-primary-600 hover:underline">Forgot Password?</a>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full py-3"
              icon={LogIn}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Fills for ease of testing */}
          <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center mb-3">
              Quick Fill for Evaluation
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setEmail('client@worksphere.com');
                  setPassword('password123');
                }}
                className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 font-medium transition-all"
              >
                Client Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('freelancer@worksphere.com');
                  setPassword('password123');
                }}
                className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 font-medium transition-all"
              >
                Freelancer Account
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-primary-600 hover:underline">
              Create an account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
