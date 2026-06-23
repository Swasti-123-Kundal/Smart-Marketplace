import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 smooth-transition">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-hidden">
          <div className="mb-6 p-4 bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-2xl tracking-wider uppercase text-center">
            Admin Management Console
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
