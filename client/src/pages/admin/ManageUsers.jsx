import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { ShieldAlert, Trash, Search } from 'lucide-react';
import Input from '../../components/common/Input';
import { formatDate } from '../../utils/formatters';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await adminService.getUsers({ search });
      setUsers(res.users || []);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleToggleBan = async (id) => {
    try {
      await adminService.toggleBanUser(id);
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to toggle ban status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      await adminService.deleteUser(id);
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  };

  if (loading && users.length === 0) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">Manage System Users</h1>
          <p className="text-slate-500 text-sm">Ban, delete, or review client and freelancer profiles.</p>
        </div>
        
        <Input
          id="userSearch"
          placeholder="Search by name or email..."
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
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <td className="px-6 py-4 font-semibold">{u.name}</td>
                  <td className="px-6 py-4 font-medium text-slate-500">{u.email}</td>
                  <td className="px-6 py-4 uppercase text-xs font-bold">{u.role}</td>
                  <td className="px-6 py-4 text-slate-400">{formatDate(u.createdAt)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={u.isBanned ? 'danger' : 'success'}>
                      {u.isBanned ? 'Banned' : 'Active'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Button
                      variant={u.isBanned ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleToggleBan(u._id)}
                      className="text-xs"
                    >
                      {u.isBanned ? 'Unban' : 'Ban'}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(u._id)}
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

export default ManageUsers;
