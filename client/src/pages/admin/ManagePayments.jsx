import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await adminService.getPayments();
        setPayments(res.payments || []);
      } catch (err) {
        setError(err.message || 'Failed to load payments');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading && payments.length === 0) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">Manage Platform Payments</h1>
        <p className="text-slate-500 text-sm">Verify system transaction orders, refund statuses, and platform fees.</p>
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
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Freelancer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30">
              {payments.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <td className="px-6 py-4 font-mono text-xs">{p.razorpayPaymentId || p._id}</td>
                  <td className="px-6 py-4 font-semibold">{p.clientId?.name}</td>
                  <td className="px-6 py-4 font-semibold">{p.freelancerId?.name}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">{formatCurrency(p.amount)}</td>
                  <td className="px-6 py-4 text-slate-400">{formatDate(p.createdAt)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={p.status === 'paid' ? 'success' : 'warning'}>
                      {p.status}
                    </Badge>
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

export default ManagePayments;
