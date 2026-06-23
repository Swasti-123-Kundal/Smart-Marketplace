import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Trash, Search } from 'lucide-react';
import Input from '../../components/common/Input';
import { formatCurrency, formatDate } from '../../utils/formatters';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await adminService.getProjects({ search });
      setProjects(res.projects || []);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project listing?')) return;
    try {
      await adminService.deleteProject(id);
      fetchProjects();
    } catch (err) {
      setError(err.message || 'Failed to delete project');
    }
  };

  if (loading && projects.length === 0) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">Manage Platform Gigs</h1>
          <p className="text-slate-500 text-sm">Review jobs post history, remove flagged posts, or manage category listings.</p>
        </div>
        
        <Input
          id="projectSearch"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={Search}
          className="max-w-xs"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-semibold rounded-xl">
          {error}
        </div>
      )}

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/50">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4">Posted</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30">
              {projects.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <td className="px-6 py-4 font-semibold">{p.title}</td>
                  <td className="px-6 py-4 font-semibold text-slate-500">{p.clientId?.name || 'Enterprise'}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">{formatCurrency(p.budget)}</td>
                  <td className="px-6 py-4 text-slate-400">{formatDate(p.createdAt)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={p.status === 'open' ? 'success' : 'warning'}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(p._id)}
                    >
                      <Trash size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ManageProjects;
