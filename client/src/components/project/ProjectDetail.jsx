import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectDetails } from '../../redux/slices/projectSlice';
import { submitProposal } from '../../redux/slices/proposalSlice';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Loader from '../common/Loader';
import Button from '../common/Button';
import Input from '../common/Input';
import ProposalList from '../proposal/ProposalList';
import { Briefcase, Calendar, DollarSign, User, ShieldAlert } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProject, loading, error } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);

  // Proposal Submission State
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    dispatch(fetchProjectDetails(id));
  }, [dispatch, id]);

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    if (!coverLetter || !bidAmount || !duration) return;

    setSubmitting(true);
    setErrMsg('');
    setSuccessMsg('');

    try {
      await dispatch(
        submitProposal({
          projectId: id,
          coverLetter,
          bidAmount: Number(bidAmount),
          duration: Number(duration),
        })
      ).unwrap();

      setSuccessMsg('Proposal submitted successfully!');
      setCoverLetter('');
      setBidAmount('');
      setDuration('');
    } catch (err) {
      setErrMsg(err.message || 'Failed to submit proposal');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-red-500">
        <ShieldAlert size={48} className="mb-4" />
        <p className="font-bold">Error loading project details</p>
        <p className="text-xs mt-1">{error}</p>
      </div>
    );
  }

  if (!currentProject) return null;

  const isFreelancer = user?.role === 'freelancer';
  const formattedBudget = formatCurrency(currentProject.budget);
  const formattedDeadline = formatDate(currentProject.deadline);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Details Section */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">
              {currentProject.title}
            </h1>
            <Badge variant={currentProject.status === 'open' ? 'success' : 'warning'}>
              {currentProject.status}
            </Badge>
          </div>

          <p className="text-slate-600 dark:text-slate-400 text-sm whitespace-pre-line leading-relaxed mb-6">
            {currentProject.description}
          </p>

          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-3">Required Skills</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {currentProject.skillsRequired?.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-800/50"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/50 pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Project Budget</p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{formattedBudget}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary-500/10 text-primary-600 rounded-xl">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Completion Deadline</p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{formattedDeadline}</p>
              </div>
            </div>
          </div>
        </Card>

        {user?.role === 'client' && (
          <div className="pt-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-4">Received Proposals</h2>
            <ProposalList projectId={currentProject._id} />
          </div>
        )}
      </div>


      {/* Sidebar: Apply form or Client Info */}
      <div className="space-y-6">
        {/* Client details */}
        <Card>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wider">About the Client</h2>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-xl">
              <User size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Posted by</p>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{currentProject.clientId?.name || 'Enterprise Client'}</p>
            </div>
          </div>
        </Card>

        {/* Apply Form for Freelancers */}
        {isFreelancer && currentProject.status === 'open' && (
          <Card>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wider">Apply for this Job</h2>
            
            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-xl">
                {successMsg}
              </div>
            )}
            {errMsg && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded-xl">
                {errMsg}
              </div>
            )}

            <form onSubmit={handleProposalSubmit} className="flex flex-col gap-4">
              <Input
                label="Bid Amount (INR)"
                id="bidAmount"
                type="number"
                placeholder="e.g. 45000"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                required
              />

              <Input
                label="Duration (in Days)"
                id="duration"
                type="number"
                placeholder="e.g. 14"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cover Letter</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Explain why you're a perfect match for this project..."
                  rows={5}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-4 text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                className="w-full py-3"
              >
                Submit Proposal
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
