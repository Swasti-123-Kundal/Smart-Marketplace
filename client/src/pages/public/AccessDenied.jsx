import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const AccessDenied = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 text-center">
      <div className="p-4 rounded-full bg-red-100 dark:bg-red-950/30 text-red-500 mb-6 animate-bounce">
        <ShieldAlert size={64} />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-950 dark:text-slate-50 tracking-tight sm:text-5xl">
        Access Denied
      </h1>
      <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-md">
        You do not have the required permissions to access this page. Please log in with a different account or contact support if you believe this is an error.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-primary-500/20"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
        <Link
          to="/login"
          className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-all"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;
