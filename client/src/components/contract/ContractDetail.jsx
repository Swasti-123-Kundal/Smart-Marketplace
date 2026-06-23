import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContractDetails, updateContractStatus } from '../../redux/slices/contractSlice';
import {
  fetchMilestones,
  addMilestone,
  submitMilestoneDeliverable,
  approveMilestoneDeliverable,
  rejectMilestoneDeliverable,
  payMilestoneDeliverable,
} from '../../redux/slices/milestoneSlice';
import disputeService from '../../services/disputeService';
import Loader from '../common/Loader';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import ReviewForm from '../review/ReviewForm';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ShieldCheck, Calendar, DollarSign, User, ShieldAlert, Award, FileText, Check, X, Send, ExternalLink, Plus, Milestone as MilestoneIcon, AlertTriangle } from 'lucide-react';

const ContractDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentContract, loading, error } = useSelector((state) => state.contracts);
  const { user } = useSelector((state) => state.auth);
  const { milestones, loading: milestonesLoading } = useSelector((state) => state.milestones);

  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [reviewed, setReviewed] = useState(false);

  // Dispute state
  const [dispute, setDispute] = useState(null);
  const [disputeLoading, setDisputeLoading] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('Work Quality');
  const [disputeDescription, setDisputeDescription] = useState('');
  const [disputeProof, setDisputeProof] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyProof, setReplyProof] = useState('');

  // Milestone Creation State
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDescription, setMilestoneDescription] = useState('');
  const [milestoneAmount, setMilestoneAmount] = useState('');

  // Milestone Submission State
  const [submitMilestoneId, setSubmitMilestoneId] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');

  // Milestone Rejection State
  const [rejectMilestoneId, setRejectMilestoneId] = useState(null);
  const [rejectFeedback, setRejectFeedback] = useState('');

  const fetchDisputeData = async () => {
    setDisputeLoading(true);
    try {
      const res = await disputeService.getDisputeByContract(id);
      setDispute(res.dispute);
    } catch (err) {
      console.log('No active dispute found or failed to fetch', err);
    } finally {
      setDisputeLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchContractDetails(id));
    dispatch(fetchMilestones(id));
    fetchDisputeData();
  }, [dispatch, id]);

  const handleRaiseDispute = async (e) => {
    e.preventDefault();
    if (!disputeDescription) return;
    setActionLoading(true);
    try {
      const res = await disputeService.raiseDispute({
        contractId: id,
        reason: disputeReason,
        description: disputeDescription,
        proofs: disputeProof ? [disputeProof] : [],
      });
      setDispute(res.dispute);
      setShowDisputeModal(false);
      setDisputeDescription('');
      setDisputeProof('');
      setMessage({ text: 'Dispute has been raised successfully. Admin has been notified.', type: 'success' });
    } catch (err) {
      setMessage({ text: err.message || 'Failed to raise dispute', type: 'danger' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReplyToDispute = async (e) => {
    e.preventDefault();
    if (!replyText) return;
    setActionLoading(true);
    try {
      const res = await disputeService.submitReply(dispute._id, {
        replyText,
        replyProofs: replyProof ? [replyProof] : [],
      });
      setDispute(res.dispute);
      setReplyText('');
      setReplyProof('');
      setMessage({ text: 'Response and proof submitted successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.message || 'Failed to submit response', type: 'danger' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setActionLoading(true);
    setMessage({ text: '', type: '' });
    try {
      await dispatch(updateContractStatus({ id, statusData: { status: newStatus } })).unwrap();
      setMessage({ text: `Contract successfully transitioned to ${newStatus}`, type: 'success' });
    } catch (err) {
      setMessage({ text: err.message || 'Failed to update contract status', type: 'danger' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    if (!milestoneTitle || !milestoneAmount) return;
    setActionLoading(true);
    try {
      await dispatch(
        addMilestone({
          contractId: id,
          milestoneData: {
            title: milestoneTitle,
            description: milestoneDescription,
            amount: parseFloat(milestoneAmount),
          },
        })
      ).unwrap();
      setMilestoneTitle('');
      setMilestoneDescription('');
      setMilestoneAmount('');
      setMessage({ text: 'Milestone created successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: err || 'Failed to create milestone', type: 'danger' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitMilestone = async (e) => {
    e.preventDefault();
    if (!submitMilestoneId) return;
    setActionLoading(true);
    try {
      await dispatch(
        submitMilestoneDeliverable({
          milestoneId: submitMilestoneId,
          submissionData: { submissionText, submissionLink },
        })
      ).unwrap();
      setSubmitMilestoneId(null);
      setSubmissionText('');
      setSubmissionLink('');
      setMessage({ text: 'Deliverables submitted successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: err || 'Failed to submit milestone', type: 'danger' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveMilestone = async (mId) => {
    setActionLoading(true);
    try {
      await dispatch(approveMilestoneDeliverable(mId)).unwrap();
      setMessage({ text: 'Milestone approved! Ready for payment.', type: 'success' });
    } catch (err) {
      setMessage({ text: err || 'Failed to approve milestone', type: 'danger' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectMilestone = async (e) => {
    e.preventDefault();
    if (!rejectMilestoneId || !rejectFeedback) return;
    setActionLoading(true);
    try {
      await dispatch(
        rejectMilestoneDeliverable({
          milestoneId: rejectMilestoneId,
          rejectData: { feedback: rejectFeedback },
        })
      ).unwrap();
      setRejectMilestoneId(null);
      setRejectFeedback('');
      setMessage({ text: 'Milestone rejected with feedback.', type: 'success' });
    } catch (err) {
      setMessage({ text: err || 'Failed to reject milestone', type: 'danger' });
    } finally {
      setActionLoading(false);
    }
  };

  const handlePayMilestone = async (mId) => {
    setActionLoading(true);
    try {
      await dispatch(payMilestoneDeliverable(mId)).unwrap();
      setMessage({ text: 'Milestone payment released successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: err || 'Failed to pay milestone', type: 'danger' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-red-500">
        <ShieldAlert size={48} className="mb-4" />
        <p className="font-bold">Error loading contract details</p>
        <p className="text-xs mt-1">{error}</p>
      </div>
    );
  }

  if (!currentContract) return null;

  const isClient = user?.role === 'client';
  const partner = isClient ? currentContract.freelancerId : currentContract.clientId;
  const project = currentContract.projectId;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">Escrow Contract Agreement</h1>
          <p className="text-slate-500 text-sm">Agreement ID: #{currentContract._id}</p>
        </div>
        <Badge variant={currentContract.status === 'completed' ? 'success' : 'primary'}>
          {currentContract.status.toUpperCase()}
        </Badge>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl border text-sm font-semibold
          ${message.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
          }
        `}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Terms */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <FileText size={20} className="text-primary-500" />
              <h2 className="text-lg font-bold text-slate-950 dark:text-slate-50">Project Description</h2>
            </div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-2">{project?.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
              {project?.description}
            </p>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={20} className="text-accent-500" />
              <h2 className="text-lg font-bold text-slate-950 dark:text-slate-50">Escrow Security Terms</h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Funds are safely locked in WorkSphere escrow. Upon successful completion of deliverables by the freelancer and approval by the client, funds will be released. Revisions can be requested by the client prior to final release.
            </p>
          </Card>

          {/* Milestone Dashboard Card */}
          <Card className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MilestoneIcon size={20} className="text-primary-500" />
                <h2 className="text-lg font-bold text-slate-950 dark:text-slate-50">Milestones Board</h2>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {milestones.length} {milestones.length === 1 ? 'Milestone' : 'Milestones'}
              </span>
            </div>

            {/* Progress Bar & Allocation Info */}
            {(() => {
              const totalAllocated = milestones.reduce((sum, m) => sum + m.amount, 0);
              const totalPaid = milestones.filter((m) => m.status === 'paid').reduce((sum, m) => sum + m.amount, 0);
              const paidPercent = currentContract.budget > 0 ? Math.round((totalPaid / currentContract.budget) * 100) : 0;
              const remainingBudget = currentContract.budget - totalAllocated;

              return (
                <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-150 dark:border-slate-800/30">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-500 uppercase tracking-wider">Milestone Funding Status</span>
                    <span className="text-slate-700 dark:text-slate-300">{paidPercent}% Paid</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${paidPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400">
                    <span>Paid: {formatCurrency(totalPaid)}</span>
                    <span>Remaining to Allocate: {formatCurrency(remainingBudget)}</span>
                  </div>
                </div>
              );
            })()}

            {/* Timeline / Milestones List */}
            {milestonesLoading ? (
              <Loader />
            ) : milestones.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No milestones created yet.</p>
            ) : (
              <div className="relative border-l-2 border-slate-200 dark:border-slate-850 ml-3.5 pl-6 space-y-8">
                {milestones.map((milestone) => {
                  const isPending = milestone.status === 'pending';
                  const isSubmitted = milestone.status === 'submitted';
                  const isApproved = milestone.status === 'approved';
                  const isPaid = milestone.status === 'paid';

                  return (
                    <div key={milestone._id} className="relative group">
                      {/* Timeline Node */}
                      <span className={`absolute -left-[33px] top-0 flex items-center justify-center w-5 h-5 rounded-full border-2 bg-white dark:bg-slate-900
                        ${isPaid ? 'border-emerald-500 text-emerald-500' : ''}
                        ${isApproved ? 'border-blue-500 text-blue-500' : ''}
                        ${isSubmitted ? 'border-amber-500 text-amber-500' : ''}
                        ${isPending ? 'border-slate-300 dark:border-slate-700 text-slate-400' : ''}
                      `}>
                        {isPaid && <Check size={10} className="stroke-[3]" />}
                      </span>

                      {/* Milestone Details Card */}
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-xs space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">{milestone.title}</h3>
                            <p className="text-[10px] text-slate-400 mt-0.5">{milestone.description || 'No description provided.'}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{formatCurrency(milestone.amount)}</span>
                            <Badge
                              variant={
                                isPaid ? 'success' :
                                isApproved ? 'primary' :
                                isSubmitted ? 'warning' : 'secondary'
                              }
                            >
                              {milestone.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        {/* Submission Display */}
                        {(isSubmitted || isApproved || isPaid) && (
                          <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50 space-y-2 text-xs">
                            <p className="font-bold text-slate-500 dark:text-slate-400">Submission Details:</p>
                            <p className="text-slate-600 dark:text-slate-350 whitespace-pre-wrap leading-relaxed">
                              {milestone.submissionText || 'No remarks provided.'}
                            </p>
                            {milestone.submissionLink && (
                              <a
                                href={milestone.submissionLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-primary-500 hover:underline font-semibold"
                              >
                                View Submitted Files <ExternalLink size={12} />
                              </a>
                            )}
                            {milestone.submittedAt && (
                              <p className="text-[10px] text-slate-400 mt-1">Submitted on {formatDate(milestone.submittedAt)}</p>
                            )}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-2 pt-1.5">
                          {/* Freelancer submits work */}
                          {!isClient && isPending && (
                            <Button
                              variant="primary"
                              size="sm"
                              icon={Send}
                              onClick={() => {
                                setSubmitMilestoneId(milestone._id);
                                setSubmissionText('');
                                setSubmissionLink('');
                              }}
                            >
                              Submit Milestone Work
                            </Button>
                          )}

                          {/* Client approves / rejects */}
                          {isClient && isSubmitted && (
                            <div className="flex gap-2">
                              <Button
                                variant="primary"
                                size="sm"
                                icon={Check}
                                onClick={() => handleApproveMilestone(milestone._id)}
                              >
                                Approve Deliverables
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                icon={X}
                                className="hover:border-red-500/20 hover:text-red-500"
                                onClick={() => {
                                  setRejectMilestoneId(milestone._id);
                                  setRejectFeedback('');
                                }}
                              >
                                Request Revisions
                              </Button>
                            </div>
                          )}

                          {/* Client pays approved milestone */}
                          {isClient && isApproved && (
                            <Button
                              variant="primary"
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 border-none text-white"
                              onClick={() => handlePayMilestone(milestone._id)}
                            >
                              Release Payment (₹{milestone.amount})
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Split Budget / Add Milestone Panel (Client only) */}
            {isClient && (() => {
              const totalAllocated = milestones.reduce((sum, m) => sum + m.amount, 0);
              const remainingBudget = currentContract.budget - totalAllocated;

              if (remainingBudget <= 0) return null;

              return (
                <div className="border-t border-slate-100 dark:border-slate-800/50 pt-6">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-1.5">
                    <Plus size={16} /> Split Project Budget into Milestones
                  </h3>
                  <form onSubmit={handleAddMilestone} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          placeholder="Milestone Title (e.g., Wireframes)"
                          value={milestoneTitle}
                          onChange={(e) => setMilestoneTitle(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3 text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-semibold text-slate-800 dark:text-slate-200"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="Amount (₹)"
                          max={remainingBudget}
                          min={1}
                          value={milestoneAmount}
                          onChange={(e) => setMilestoneAmount(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3 text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-semibold text-slate-800 dark:text-slate-200"
                          required
                        />
                      </div>
                    </div>
                    <textarea
                      placeholder="Milestone Description / Deliverables list..."
                      value={milestoneDescription}
                      onChange={(e) => setMilestoneDescription(e.target.value)}
                      rows={2}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3 text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-800 dark:text-slate-200"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-medium">
                        Remaining Budget: ₹{remainingBudget}
                      </span>
                      <Button type="submit" variant="primary" size="sm" loading={actionLoading}>
                        Allocate Milestone
                      </Button>
                    </div>
                  </form>
                </div>
              );
            })()}
          </Card>

          {/* Submission Modal */}
          {submitMilestoneId && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <Card className="max-w-md w-full space-y-4 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-950 dark:text-slate-50 text-sm">Submit Milestone Deliverables</h3>
                  <button onClick={() => setSubmitMilestoneId(null)} className="text-slate-400 hover:text-slate-500">
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleSubmitMilestone} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submission Remarks</label>
                    <textarea
                      placeholder="Detail what was completed, how to verify it..."
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3 text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-800 dark:text-slate-200"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Files Link (Google Drive / GitHub / Dropbox)</label>
                    <input
                      type="url"
                      placeholder="https://github.com/my-submission"
                      value={submissionLink}
                      onChange={(e) => setSubmissionLink(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3 text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-semibold text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setSubmitMilestoneId(null)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="sm" loading={actionLoading}>
                      Submit Deliverables
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}

          {/* Rejection Modal */}
          {rejectMilestoneId && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <Card className="max-w-md w-full space-y-4 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-950 dark:text-slate-50 text-sm">Request Milestone Revisions</h3>
                  <button onClick={() => setRejectMilestoneId(null)} className="text-slate-400 hover:text-slate-500">
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleRejectMilestone} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Feedback & Required Revisions</label>
                    <textarea
                      placeholder="Describe what needs to be fixed or updated..."
                      value={rejectFeedback}
                      onChange={(e) => setRejectFeedback(e.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3 text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-800 dark:text-slate-200"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setRejectMilestoneId(null)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="sm" className="bg-red-650 hover:bg-red-700 border-none text-white" loading={actionLoading}>
                      Reject & Request Revisions
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}
          {/* Dispute Resolution Board */}
          {disputeLoading ? (
            <Loader />
          ) : dispute ? (
            <Card className="space-y-4 border-red-500/20 dark:border-red-500/10">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertTriangle size={20} />
                <h2 className="text-lg font-bold">Dispute Resolution Active</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50 text-xs">
                <div className="space-y-2">
                  <p className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Dispute Details</p>
                  <p><span className="font-semibold">Reason:</span> {dispute.reason}</p>
                  <p><span className="font-semibold">Raised By:</span> {dispute.raisedBy?.name}</p>
                  <p><span className="font-semibold">Status:</span> 
                    <Badge variant={dispute.status === 'Resolved' ? 'success' : dispute.status === 'Under Review' ? 'warning' : 'danger'} className="ml-1.5">
                      {dispute.status.toUpperCase()}
                    </Badge>
                  </p>
                  <p className="whitespace-pre-wrap"><span className="font-semibold">Description:</span> {dispute.description}</p>
                  {dispute.proofs && dispute.proofs.length > 0 && (
                    <p>
                      <span className="font-semibold">Evidence:</span>{' '}
                      <a href={dispute.proofs[0]} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline inline-flex items-center gap-0.5">
                        View proof link <ExternalLink size={10} />
                      </a>
                    </p>
                  )}
                </div>

                <div className="space-y-2 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 sm:pl-4">
                  <p className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Counterparty Response</p>
                  {dispute.replyText ? (
                    <div className="space-y-1">
                      <p className="whitespace-pre-wrap">{dispute.replyText}</p>
                      {dispute.replyProofs && dispute.replyProofs.length > 0 && (
                        <p>
                          <a href={dispute.replyProofs[0]} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline inline-flex items-center gap-0.5">
                            View defense link <ExternalLink size={10} />
                          </a>
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      {dispute.raisedBy?._id?.toString() !== user?._id?.toString() ? (
                        <form onSubmit={handleReplyToDispute} className="space-y-3">
                          <textarea
                            placeholder="Submit your defense statement, details or clarifications..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={3}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2 px-3 text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-800 dark:text-slate-200"
                            required
                          />
                          <input
                            type="url"
                            placeholder="Link to proofs (PDF/Image link)"
                            value={replyProof}
                            onChange={(e) => setReplyProof(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2 px-3 text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-semibold text-slate-800 dark:text-slate-200"
                          />
                          <Button type="submit" variant="primary" size="sm" loading={actionLoading}>
                            Submit Defense Response
                          </Button>
                        </form>
                      ) : (
                        <p className="text-slate-400 italic">Waiting for the counterparty response...</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {dispute.status === 'Resolved' && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-xs space-y-2">
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">⚖️ Admin Resolution Decision</p>
                  <p><span className="font-semibold">Resolution:</span> {dispute.decision}</p>
                  {dispute.adminRemarks && <p><span className="font-semibold">Remarks:</span> {dispute.adminRemarks}</p>}
                  {dispute.resolvedAt && <p className="text-[10px] text-slate-400">Resolved on {formatDate(dispute.resolvedAt)}</p>}
                </div>
              )}
            </Card>
          ) : (
            <div className="flex justify-end pt-4">
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 font-bold"
                onClick={() => {
                  setDisputeReason('Work Quality');
                  setDisputeDescription('');
                  setDisputeProof('');
                  setShowDisputeModal(true);
                }}
              >
                Raise Dispute ⚠️
              </Button>
            </div>
          )}

          {/* Raise Dispute Modal */}
          {showDisputeModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <Card className="max-w-md w-full space-y-4 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-950 dark:text-slate-50 text-sm">Raise Contract Dispute</h3>
                  <button onClick={() => setShowDisputeModal(false)} className="text-slate-400 hover:text-slate-500">
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleRaiseDispute} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reason for Dispute</label>
                    <select
                      value={disputeReason}
                      onChange={(e) => setDisputeReason(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-semibold text-slate-800 dark:text-slate-200"
                    >
                      <option value="Work Quality">Work Quality</option>
                      <option value="Late Delivery">Late Delivery</option>
                      <option value="Scam">Scam</option>
                      <option value="Payment Issue">Payment Issue</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dispute Details & Explanation</label>
                    <textarea
                      placeholder="Detail why you are filing a dispute. Be as specific as possible..."
                      value={disputeDescription}
                      onChange={(e) => setDisputeDescription(e.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3 text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-800 dark:text-slate-200"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Evidence Link (PDF / Screen Recording / Image Link)</label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/myfile"
                      value={disputeProof}
                      onChange={(e) => setDisputeProof(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3 text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-semibold text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowDisputeModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="sm" className="bg-red-600 hover:bg-red-700 border-none text-white font-bold" loading={actionLoading}>
                      File Dispute
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}
        </div>

        {/* Info Sidebar & Actions */}
        <div className="space-y-6">
          <Card className="flex flex-col gap-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Financial Overview</h2>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Locked Budget</p>
                <p className="text-base font-bold text-slate-950 dark:text-slate-50">{formatCurrency(currentContract.budget)}</p>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col gap-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{isClient ? 'Freelancer Assigned' : 'Client Sponsor'}</h2>
            <div className="flex items-center gap-3">
              <Avatar src={partner?.profileImage} name={partner?.name} size="md" />
              <div>
                <p className="text-sm font-bold text-slate-950 dark:text-slate-50">{partner?.name}</p>
                <p className="text-xs text-slate-400">{partner?.email}</p>
              </div>
            </div>
          </Card>

          {/* Action Panel */}
          <Card className="space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Action console</h2>
            
            {project?._id && (
              <Link
                to={isClient ? `/client/workspace/${project._id}` : `/freelancer/workspace/${project._id}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm"
              >
                <Users size={16} />
                Go to Project Workspace
              </Link>
            )}
            
            {/* Freelancer actions */}
            {!isClient && currentContract.status === 'pending' && (
              <Button
                variant="primary"
                className="w-full"
                loading={actionLoading}
                onClick={() => handleStatusUpdate('in_progress')}
              >
                Accept & Start Work
              </Button>
            )}

            {!isClient && currentContract.status === 'in_progress' && (
              <Button
                variant="primary"
                className="w-full"
                loading={actionLoading}
                onClick={() => handleStatusUpdate('submitted')}
              >
                Submit Deliverables
              </Button>
            )}

            {/* Client actions */}
            {isClient && currentContract.status === 'submitted' && (
              <div className="space-y-2">
                <Button
                  variant="primary"
                  className="w-full"
                  loading={actionLoading}
                  onClick={() => handleStatusUpdate('completed')}
                >
                  Approve & Release Funds
                </Button>
                <Button
                  variant="outline"
                  className="w-full hover:border-red-500/20 hover:text-red-500"
                  loading={actionLoading}
                  onClick={() => handleStatusUpdate('in_progress')}
                >
                  Request Revisions
                </Button>
              </div>
            )}

            {currentContract.status === 'completed' && (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center text-xs font-semibold text-emerald-600">
                  🎉 Funds released successfully! Contract Completed.
                </div>
                {isClient && !reviewed && (
                  <ReviewForm
                    contractId={currentContract._id}
                    freelancerId={currentContract.freelancerId?._id}
                    onReviewSubmitted={() => {
                      setReviewed(true);
                      setMessage({ text: 'Thank you for your feedback!', type: 'success' });
                    }}
                  />
                )}
              </div>
            )}

            {currentContract.status === 'pending' && isClient && (
              <p className="text-xs text-slate-400 text-center font-medium">
                Waiting for the freelancer to accept the agreement and start.
              </p>
            )}

            {currentContract.status === 'in_progress' && isClient && (
              <p className="text-xs text-slate-400 text-center font-medium">
                Project is active. Freelancer is working.
              </p>
            )}

            {currentContract.status === 'submitted' && !isClient && (
              <p className="text-xs text-slate-400 text-center font-medium">
                Deliverables submitted. Waiting for client review and release.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;
