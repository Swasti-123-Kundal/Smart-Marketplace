import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import Card from '../../components/common/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getStats();
        setStats(res.stats);
      } catch (err) {
        setError(err.message || 'Failed to load platform analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  // Map users growth charts data
  const userChartData = stats?.monthlyUsers?.map((m) => ({
    name: `${m._id.month}/${m._id.year}`,
    registrations: m.count,
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">Platform Registrations Analytics</h1>
        <p className="text-slate-500 text-sm">Review platform-wide user growth and registrations trends.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-semibold rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col gap-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">User Growth Chart (Last 6 Months)</h3>
          
          {userChartData.length === 0 ? (
            <div className="flex items-center justify-center min-h-[250px] text-xs font-semibold text-slate-400">
              No new user registrations to chart yet
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="registrations" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Roles Distribution */}
        <Card className="flex flex-col gap-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">User Roles Allocation</h3>
          <div className="grid grid-cols-2 gap-4 mt-4 text-center">
            <div className="p-6 bg-primary-500/5 border border-primary-500/10 rounded-2xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Clients count</span>
              <span className="text-3xl font-extrabold text-primary-600">{stats?.totalClients}</span>
            </div>
            <div className="p-6 bg-accent-500/5 border border-accent-500/10 rounded-2xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Freelancers count</span>
              <span className="text-3xl font-extrabold text-accent-600">{stats?.totalFreelancers}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
