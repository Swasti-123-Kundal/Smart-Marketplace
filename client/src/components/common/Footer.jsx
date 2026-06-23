import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col gap-3">
            <Link to="/" className="text-xl font-extrabold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              WorkSphere
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              The smart marketplace platform connecting top talent with elite clients around the world.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">For Clients</h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
              <li><Link to="/login" className="hover:text-primary-500 transition-colors">Post a Project</Link></li>
              <li><Link to="/login" className="hover:text-primary-500 transition-colors">Browse Freelancers</Link></li>
              <li><Link to="/" className="hover:text-primary-500 transition-colors">Enterprise Solutions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">For Freelancers</h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
              <li><Link to="/login" className="hover:text-primary-500 transition-colors">Find Projects</Link></li>
              <li><Link to="/login" className="hover:text-primary-500 transition-colors">Upload Portfolio</Link></li>
              <li><Link to="/" className="hover:text-primary-500 transition-colors">Skill Assessments</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Platform</h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
              <li><Link to="/" className="hover:text-primary-500 transition-colors">Terms of Service</Link></li>
              <li><Link to="/" className="hover:text-primary-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-primary-500 transition-colors">Support & Help</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400">
          <p>© {new Date().getFullYear()} WorkSphere Inc. All rights reserved.</p>
          <p>Created for smart freelancers and enterprises.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
