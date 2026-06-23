import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import Card from '../../components/common/Card';
import { Users, Briefcase, FileText, DollarSign, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getStats();
        setStats(res.stats);
      } catch (err) {
        setError(err.message || 'Failed to load platform statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  // Map charts data
  const revenueChartData = stats?.monthlyRevenue?.map((m) => ({
    name: `${m._id.month}/${m._id.year}`,
    revenue: m.amount,
  })) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-950 dark:text-slate-50">Platform Performance Stats</h1>
        <p className="text-slate-500 text-sm">Review platform-wide registrations, escrow totals, and revenues.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl">
          {error}
        </div>
      )}

      {/* Admin stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="flex items-center gap-4 bg-primary-500/5 border border-primary-500/10">
          <div className="p-3 bg-primary-500/10 text-primary-600 rounded-2xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</p>
            <p className="text-xl font-extrabold text-slate-950 dark:text-slate-50">{stats?.totalUsers}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-accent-500/5 border border-accent-500/10">
          <div className="p-3 bg-accent-500/10 text-accent-600 rounded-2xl">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Projects</p>
            <p className="text-xl font-extrabold text-slate-950 dark:text-slate-50">{stats?.totalProjects}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-blue-500/5 border border-blue-500/10">
          <div className="p-3 bg-blue-500/10 text-blue-600 rounded-2xl">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Contracts</p>
            <p className="text-xl font-extrabold text-slate-950 dark:text-slate-50">{stats?.totalContracts}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/10">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Revenue</p>
            <p className="text-xl font-extrabold text-slate-950 dark:text-slate-50">{formatCurrency(stats?.totalRevenue)}</p>
          </div>
        </Card>
      </div>

      {/* Platform revenue chart */}
      <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-emerald-500" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Revenue Stream (Last 6 Months)</h3>
        </div>
        
        {revenueChartData.length === 0 ? (
          <div className="flex items-center justify-center min-h-[250px] text-xs font-semibold text-slate-400">
            No completed monthly revenues to chart yet
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="adminColorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#adminColorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;
