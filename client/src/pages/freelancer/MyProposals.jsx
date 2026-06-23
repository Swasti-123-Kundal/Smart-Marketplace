import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyProposals } from '../../redux/slices/proposalSlice';
import ProposalCard from '../../components/proposal/ProposalCard';
import Loader from '../../components/common/Loader';
import { Inbox } from 'lucide-react';

const MyProposals = () => {
  const dispatch = useDispatch();
  const { myProposals, loading, error } = useSelector((state) => state.proposals);

  useEffect(() => {
    dispatch(fetchMyProposals());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">My Submitted Proposals</h1>
        <p className="text-slate-500 text-sm">Track bids, cover letters, and review responses from clients.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl">
          {error}
        </div>
      )}

      {myProposals.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center bg-white dark:bg-slate-900/50 animate-fade-in">
          <Inbox size={40} className="text-slate-400 mb-3" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">No Proposals Submitted</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1">
            You haven't bid on any projects yet. Go to Browse Jobs to start applying!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myProposals.map((proposal) => (
            <div key={proposal._id} className="relative">
              <div className="absolute top-4 right-4 z-10 text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                Project: {proposal.projectId?.title || 'Open Job'}
              </div>
              <ProposalCard proposal={proposal} showActions={false} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProposals;
