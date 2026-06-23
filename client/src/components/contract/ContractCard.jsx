import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Calendar, User } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';

const ContractCard = ({ contract, userRole }) => {
  const isClient = userRole === 'client';
  const partner = isClient ? contract.freelancerId : contract.clientId;
  
  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'primary';
      case 'submitted':
        return 'warning';
      case 'pending':
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      case 'submitted':
        return 'Submitted for Review';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <Card hoverable className="flex flex-col h-full justify-between">
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-bold text-base text-slate-950 dark:text-slate-50 line-clamp-1">
            {contract.projectId?.title || 'Contract Agreement'}
          </h3>
          <Badge variant={getStatusVariant(contract.status)}>
            {getStatusLabel(contract.status)}
          </Badge>
        </div>

        {/* Partner Details */}
        <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <User size={14} className="text-slate-400" />
          <span>{isClient ? 'Freelancer' : 'Client'}: {partner?.name || 'Anonymous User'}</span>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800/50 pt-4 flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Contract Budget</span>
          <span className="text-sm font-bold text-emerald-500">{formatCurrency(contract.budget)}</span>
        </div>

        <Link to={isClient ? `/client/contracts/${contract._id}` : `/freelancer/contracts/${contract._id}`}>
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all">
            View Agreement
          </button>
        </Link>
      </div>
    </Card>
  );
};

export default ContractCard;
