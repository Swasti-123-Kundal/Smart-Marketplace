import React, { useEffect, useState } from 'react';
import disputeService from '../../services/disputeService';
import Loader from '../../components/common/Loader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import { AlertTriangle, ExternalLink, Calendar, MessageSquare, CheckCircle, ShieldAlert, X } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const ManageDisputes = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [adminRemarks, setAdminRemarks] = useState('');
  const [decision, setDecision] = useState('Release Payment');
  const [submitting, setSubmitting] = useState(false);

  const fetchDisputes = async () => {
    setLoading(true);
    try {
      const res = await disputeService.getAllDisputes();
      setDisputes(res.disputes || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch disputes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleResolve = async (e) => {
    e.preventDefault();
    if (!selectedDispute) return;
    setSubmitting(true);
    try {
      await disputeService.resolveDispute(selectedDispute._id, {
        decision,
        adminRemarks,
      });
      // Refresh list
      await fetchDisputes();
      setSelectedDispute(null);
      setAdminRemarks('');
    } catch (err) {
      setError(err.message || 'Failed to resolve dispute');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50 flex items-center gap-2">
          <AlertTriangle className="text-red-500" />
          Dispute Resolution Center
        </h1>
        <p className="text-slate-500 text-sm">
          Review claims, analyze submitted evidence, and issue refund or payment release decisions.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-semibold rounded-xl">
          {error}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : disputes.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <CheckCircle size={40} className="text-emerald-500 mb-3" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">System Clear</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1">
            No active disputes found in the database. All contracts are running smoothly.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* List panel */}
          <div className="xl:col-span-2 space-y-4">
            <Card className="overflow-x-auto p-0">
              <table className="w-full border-collapse text-left text-xs text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 uppercase font-bold text-[10px] tracking-wider text-slate-400">
                  <tr>
                    <th className="py-4 px-6">Disputed Project</th>
                    <th className="py-4 px-6">Initiated By</th>
                    <th className="py-4 px-6">Reason</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                  {disputes.map((d) => (
                    <tr key={d._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-200">
                        {d.contractId?.projectId?.title || 'Unknown Project'}
                        <span className="block text-[10px] font-semibold text-slate-400 mt-0.5">ID: #{d._id}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Avatar src={d.raisedBy?.profileImage} name={d.raisedBy?.name} size="xs" />
                          <div>
                            <p className="font-semibold text-slate-850 dark:text-slate-250">{d.raisedBy?.name}</p>
                            <p className="text-[10px] text-slate-400">{d.raisedBy?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">{d.reason}</td>
                      <td className="py-4 px-6">
                        <Badge variant={d.status === 'Resolved' ? 'success' : d.status === 'Under Review' ? 'warning' : 'danger'}>
                          {d.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedDispute(d);
                            setAdminRemarks(d.adminRemarks || '');
                            setDecision(d.decision || 'Release Payment');
                          }}
                        >
                          Review Case
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          {/* Details / Resolution Form Panel */}
          <div>
            {selectedDispute ? (
              <Card className="space-y-5 h-fit sticky top-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 pb-3">
                  <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">Dispute Review Panel</h2>
                  <button onClick={() => setSelectedDispute(null)} className="text-slate-400 hover:text-slate-500">
                    <X size={16} />
                  </button>
                </div>

                <div className="text-xs space-y-3.5">
                  <div>
                    <span className="font-semibold text-slate-400 uppercase tracking-wider block text-[9px] mb-1">Project</span>
                    <p className="font-bold text-slate-850 dark:text-slate-200">
                      {selectedDispute.contractId?.projectId?.title}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-400 uppercase tracking-wider block text-[9px] mb-1">Contract Parties</span>
                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
                      <div>
                        <span className="text-[9px] uppercase text-slate-400 block font-bold">Client</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{selectedDispute.contractId?.clientId?.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase text-slate-400 block font-bold">Freelancer</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{selectedDispute.contractId?.freelancerId?.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-500/5 border border-red-500/10 p-3 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-red-600 dark:text-red-400">
                      <ShieldAlert size={14} />
                      <span>Case details ({selectedDispute.reason})</span>
                    </div>
                    <p className="text-slate-650 dark:text-slate-350 leading-relaxed">{selectedDispute.description}</p>
                    {selectedDispute.proofs && selectedDispute.proofs.length > 0 && (
                      <a
                        href={selectedDispute.proofs[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary-500 hover:underline font-bold"
                      >
                        View Initiator Evidence Link <ExternalLink size={10} />
                      </a>
                    )}
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800/40 p-3 rounded-xl space-y-2">
                    <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <MessageSquare size={14} /> Response Defense Statement
                    </p>
                    {selectedDispute.replyText ? (
                      <>
                        <p className="text-slate-650 dark:text-slate-350 leading-relaxed">{selectedDispute.replyText}</p>
                        {selectedDispute.replyProofs && selectedDispute.replyProofs.length > 0 && (
                          <a
                            href={selectedDispute.replyProofs[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary-500 hover:underline font-bold"
                          >
                            View Defense Evidence Link <ExternalLink size={10} />
                          </a>
                        )}
                      </>
                    ) : (
                      <p className="italic text-slate-400">No response defense submitted yet.</p>
                    )}
                  </div>
                </div>

                {selectedDispute.status !== 'Resolved' ? (
                  <form onSubmit={handleResolve} className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Remarks / Case assessment</label>
                      <textarea
                        placeholder="Write admin review comments and rationale for decision..."
                        value={adminRemarks}
                        onChange={(e) => setAdminRemarks(e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3 text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-800 dark:text-slate-200"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resolution Decision</label>
                      <select
                        value={decision}
                        onChange={(e) => setDecision(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-semibold text-slate-800 dark:text-slate-200"
                      >
                        <option value="Release Payment">Release Payment to Freelancer</option>
                        <option value="Refund Client">Refund Client (Escrow Return)</option>
                        <option value="Close Dispute">Dismiss Case / Close Dispute</option>
                      </select>
                    </div>

                    <Button type="submit" variant="primary" className="w-full" loading={submitting}>
                      Issue Resolution Order
                    </Button>
                  </form>
                ) : (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-xs space-y-2 mt-4">
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">⚖️ Resolved Case</p>
                    <p><span className="font-semibold text-slate-400">Decision:</span> {selectedDispute.decision}</p>
                    <p><span className="font-semibold text-slate-400">Remarks:</span> {selectedDispute.adminRemarks}</p>
                    <p className="text-[10px] text-slate-400">Closed on {formatDate(selectedDispute.resolvedAt)}</p>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <ShieldAlert size={28} className="mb-2" />
                <p className="text-xs font-semibold">Select a case from the list to begin review and resolution.</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDisputes;
