import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProposalsForProject } from '../../redux/slices/proposalSlice';
import ProposalCard from './ProposalCard';
import Loader from '../common/Loader';
import { Inbox } from 'lucide-react';

const ProposalList = ({ projectId }) => {
  const dispatch = useDispatch();
  const { proposals, loading, error } = useSelector((state) => state.proposals);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProposalsForProject(projectId));
    }
  }, [dispatch, projectId]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs font-semibold">
        {error}
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <Inbox size={32} className="mb-2 opacity-50" />
        <p className="text-xs font-semibold">No applications received yet for this project</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {proposals.map((proposal) => (
        <ProposalCard
          key={proposal._id}
          proposal={proposal}
          showActions={true}
        />
      ))}
    </div>
  );
};

export default ProposalList;
