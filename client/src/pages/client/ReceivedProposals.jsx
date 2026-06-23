import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyProjects } from '../../redux/slices/projectSlice';
import ProposalList from '../../components/proposal/ProposalList';
import Card from '../../components/common/Card';
import { Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReceivedProposals = () => {
  const dispatch = useDispatch();
  const { myProjects, loading } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchMyProjects());
  }, [dispatch]);

  const activeProjects = myProjects.filter((p) => p.status === 'open');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">Received Applications</h1>
        <p className="text-slate-500 text-sm">Select one of your active listings to review incoming freelancer bids.</p>
      </div>

      <div className="flex flex-col gap-4">
        {activeProjects.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <p className="text-xs font-semibold">You don't have any open project listings currently</p>
          </div>
        ) : (
          activeProjects.map((project) => (
            <Card key={project._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-base text-slate-950 dark:text-slate-50">{project.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Budget: ₹{project.budget} | Status: {project.status}</p>
              </div>
              <Link to={`/client/projects/${project._id}`}>
                <button className="flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700">
                  Review Bids
                  <ArrowRight size={14} />
                </button>
              </Link>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ReceivedProposals;
