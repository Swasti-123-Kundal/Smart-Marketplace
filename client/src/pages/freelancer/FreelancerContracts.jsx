import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContracts } from '../../redux/slices/contractSlice';
import ContractCard from '../../components/contract/ContractCard';
import Loader from '../../components/common/Loader';
import { Inbox } from 'lucide-react';

const FreelancerContracts = () => {
  const dispatch = useDispatch();
  const { contracts, loading, error } = useSelector((state) => state.contracts);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchContracts());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">Active Milestones & Agreements</h1>
        <p className="text-slate-500 text-sm">Submit deliverables, review milestones timeline, and verify payouts.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl">
          {error}
        </div>
      )}

      {contracts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center bg-white dark:bg-slate-900/50">
          <Inbox size={40} className="text-slate-400 mb-3" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">No Gigs Active Currently</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1">
            Apply to project listings. Once a client accepts your bid, an escrow agreement will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contracts.map((contract) => (
            <ContractCard
              key={contract._id}
              contract={contract}
              userRole={user?.role}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FreelancerContracts;
