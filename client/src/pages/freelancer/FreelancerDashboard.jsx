import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyProposals } from '../../redux/slices/proposalSlice';
import { fetchContracts } from '../../redux/slices/contractSlice';
import Loader from '../../components/common/Loader';
import Card from '../../components/common/Card';
import { Briefcase, FileText, DollarSign, ChevronRight, BarChart2, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const FreelancerDashboard = () => {
  const dispatch = useDispatch();
  const { myProposals, loading: proposalsLoading } = useSelector((state) => state.proposals);
  const { contracts, loading: contractsLoading } = useSelector((state) => state.contracts);

  useEffect(() => {
    dispatch(fetchMyProposals());
    dispatch(fetchContracts());
  }, [dispatch]);

  if (proposalsLoading || contractsLoading) return <Loader />;

  // Compute stats
  const totalBids = myProposals.length;
  const activeContracts = contracts.filter((c) => c.status === 'in_progress').length;
  const totalEarned = contracts
    .filter((c) => c.status === 'completed')
    .reduce((sum, c) => sum + c.budget, 0);

  // Prepare chart data based on active/completed contracts
  const chartData = contracts
    .filter((c) => c.status === 'completed' || c.status === 'in_progress')
    .slice(0, 6)
    .map((c) => ({
      name: c.projectId?.title ? c.projectId.title.slice(0, 10) + '...' : 'Gig',
      revenue: c.budget,
    }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-950 dark:text-slate-50">Freelancer Workspace Overview</h1>
        <p className="text-slate-500 text-sm font-medium">Verify system activity, check active contracts, and check status of bids.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4 bg-primary-500/5 border border-primary-500/10">
          <div className="p-3 bg-primary-500/10 text-primary-600 rounded-2xl">
            <Inbox size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bids Submitted</p>
            <p className="text-2xl font-extrabold text-slate-950 dark:text-slate-50">{totalBids}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-accent-500/5 border border-accent-500/10">
          <div className="p-3 bg-accent-500/10 text-accent-600 rounded-2xl">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Assignments</p>
            <p className="text-2xl font-extrabold text-slate-950 dark:text-slate-50">{activeContracts}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/10">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Income Earned</p>
            <p className="text-2xl font-extrabold text-slate-950 dark:text-slate-50">{formatCurrency(totalEarned)}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Card */}
        <Card className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <BarChart2 size={18} className="text-primary-500" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Revenue Stream Allocation</h3>
          </div>
          
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center min-h-[250px] text-xs font-semibold text-slate-400">
              No active or completed contracts to chart yet
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Action Quick Links */}
        <Card className="flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-4">Workspace Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <Link
                to="/freelancer/browse"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                <span>Browse Project Gigs</span>
                <ChevronRight size={14} />
              </Link>
              <Link
                to="/freelancer/contracts"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                <span>View Assigned Contracts</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
