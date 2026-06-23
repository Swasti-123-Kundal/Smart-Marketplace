import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, MessageSquare, Briefcase, PlusCircle, LayoutDashboard } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import NotificationDropdown from './NotificationDropdown';
import Avatar from './Avatar';
import Button from './Button';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'client') return '/client';
    return '/freelancer';
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-extrabold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              WorkSphere
            </Link>

            {/* Navigation links based on role */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <Link to={getDashboardPath()} className="hover:text-primary-500 transition-colors flex items-center gap-1.5">
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                {user?.role === 'client' && (
                  <>
                    <Link to="/client/projects" className="hover:text-primary-500 transition-colors flex items-center gap-1.5">
                      <Briefcase size={16} />
                      My Projects
                    </Link>
                    <Link to="/client/create-project" className="hover:text-primary-500 transition-colors flex items-center gap-1.5 text-accent-500">
                      <PlusCircle size={16} />
                      Post Project
                    </Link>
                  </>
                )}
                {user?.role === 'freelancer' && (
                  <>
                    <Link to="/freelancer/browse" className="hover:text-primary-500 transition-colors flex items-center gap-1.5">
                      <Briefcase size={16} />
                      Browse Projects
                    </Link>
                    <Link to="/freelancer/proposals" className="hover:text-primary-500 transition-colors flex items-center gap-1.5">
                      My Proposals
                    </Link>
                  </>
                )}
                {user?.role !== 'admin' && (
                  <Link to={user?.role === 'client' ? '/client/messages' : '/freelancer/messages'} className="hover:text-primary-500 transition-colors flex items-center gap-1.5">
                    <MessageSquare size={16} />
                    Messages
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Right section controls */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <>
                <NotificationDropdown />
                
                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center gap-2 focus:outline-none cursor-pointer">
                    <Avatar src={user?.avatar} name={user?.name} size="sm" />
                    <span className="hidden sm:inline text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {user?.name}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl glass-card py-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-4 py-2 border-b border-slate-200/50 dark:border-slate-800/50">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{user?.email}</p>
                    </div>

                    {user?.role === 'freelancer' && (
                      <Link to="/freelancer/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                        <User size={16} />
                        My Profile
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-500/5 transition-colors text-left font-semibold"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link to="/signup" className="hidden sm:block">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
