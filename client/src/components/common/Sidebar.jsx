import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  MessageSquare,
  FileText,
  CreditCard,
  Settings,
  User,
  Users,
  BarChart2,
  DollarSign,
  AlertTriangle,
  Trophy,
  Mail
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();

  const getLinks = () => {
    if (user?.role === 'client') {
      return [
        { to: '/client', label: 'Overview', icon: LayoutDashboard },
        { to: '/client/browse-freelancers', label: 'Find Talent', icon: Users },
        { to: '/client/leaderboard', label: 'Leaderboard', icon: Trophy },
        { to: '/client/projects', label: 'My Projects', icon: Briefcase },
        { to: '/client/create-project', label: 'Post Project', icon: PlusCircle },
        { to: '/client/contracts', label: 'Contracts', icon: FileText },
        { to: '/client/messages', label: 'Messages', icon: MessageSquare },
        { to: '/client/payments', label: 'Payments', icon: CreditCard },
        { to: '/client/settings', label: 'Settings', icon: Settings },
      ];
    }

    if (user?.role === 'freelancer') {
      return [
        { to: '/freelancer', label: 'Overview', icon: LayoutDashboard },
        { to: '/freelancer/browse', label: 'Browse Jobs', icon: Briefcase },
        { to: '/freelancer/leaderboard', label: 'Leaderboard', icon: Trophy },
        { to: '/freelancer/proposals', label: 'My Proposals', icon: FileText },
        { to: '/freelancer/contracts', label: 'Contracts', icon: FileText },
        { to: '/freelancer/messages', label: 'Messages', icon: MessageSquare },
        { to: '/freelancer/earnings', label: 'Earnings', icon: DollarSign },
        { to: '/freelancer/team-invitations', label: 'Team Offers', icon: Mail },
        { to: '/freelancer/profile', label: 'My Profile', icon: User },
        { to: '/freelancer/settings', label: 'Settings', icon: Settings },
      ];
    }

    if (user?.role === 'admin') {
      return [
        { to: '/admin', label: 'Overview', icon: LayoutDashboard },
        { to: '/admin/users', label: 'Manage Users', icon: Users },
        { to: '/admin/projects', label: 'Manage Projects', icon: Briefcase },
        { to: '/admin/contracts', label: 'Contracts Lifecycle', icon: FileText },
        { to: '/admin/payments', label: 'Payments oversight', icon: CreditCard },
        { to: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
        { to: '/admin/disputes', label: 'Manage Disputes', icon: AlertTriangle },
      ];
    }

    return [];
  };

  const links = getLinks();

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200/50 dark:border-slate-800/50 min-h-[calc(100vh-4rem)] flex flex-col p-4 gap-1 z-10 shrink-0">
      <div className="px-3 py-2 mb-4">
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Navigation
        </p>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                ${isActive
                  ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 shadow-sm border border-primary-100/50 dark:border-primary-900/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-950 dark:hover:text-slate-50'
                }
              `}
            >
              <Icon size={18} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
