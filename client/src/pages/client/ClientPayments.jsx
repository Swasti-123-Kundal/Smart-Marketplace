import React, { useEffect, useState } from 'react';
import paymentService from '../../services/paymentService';
import Loader from '../../components/common/Loader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CreditCard, Inbox, DollarSign } from 'lucide-react';

const ClientPayments = () => {
  const [payments, setPayments] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await paymentService.getPayments();
        setPayments(res.payments || []);
        setTotalSpent(res.totalAmount || 0);
      } catch (err) {
        setError(err.message || 'Failed to load payments history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">Payments History</h1>
          <p className="text-slate-500 text-sm">Review your billing statements and platform transactions.</p>
        </div>
        
        {/* Total Spend Stat */}
        <Card className="p-4 flex items-center gap-3 w-fit bg-primary-500/5 border border-primary-500/10 shrink-0">
          <div className="p-2 bg-primary-500/10 text-primary-600 rounded-xl">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Investment</p>
            <p className="text-base font-bold text-slate-950 dark:text-slate-50">{formatCurrency(totalSpent)}</p>
          </div>
        </Card>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl">
          {error}
        </div>
      )}

      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center bg-white dark:bg-slate-900/50">
          <Inbox size={40} className="text-slate-400 mb-3" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">No Transactions Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1">
            All payment receipts and invoices will be catalogued here once projects start.
          </p>
        </div>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/50">
                <tr>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Freelancer</th>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30">
                {payments.map((pay) => (
                  <tr key={pay._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                    <td className="px-6 py-4 font-mono text-xs">{pay.razorpayPaymentId || pay._id}</td>
                    <td className="px-6 py-4 font-semibold">{pay.freelancerId?.name || 'Assigned Partner'}</td>
                    <td className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">
                      {pay.contractId?.projectId?.title || 'Gig Project'}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600">{formatCurrency(pay.amount)}</td>
                    <td className="px-6 py-4 text-slate-400">{formatDate(pay.createdAt)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={pay.status === 'paid' ? 'success' : 'warning'}>
                        {pay.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ClientPayments;
