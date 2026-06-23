import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, DollarSign, User, Check, X, ShieldAlert } from 'lucide-react';
import { acceptProposal, rejectProposal } from '../../redux/slices/proposalSlice';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import { formatCurrency, formatDate } from '../../utils/formatters';

const ProposalCard = ({ proposal, showActions = false }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleAccept = () => {
    dispatch(acceptProposal(proposal._id));
  };

  const handleReject = () => {
    dispatch(rejectProposal(proposal._id));
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'pending':
      default:
        return 'warning';
    }
  };

  const formattedBid = formatCurrency(proposal.bidAmount);

  return (
    <Card className="flex flex-col gap-4">
      {/* Top Freelancer Meta */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar
            src={proposal.freelancerId?.profileImage}
            name={proposal.freelancerId?.name}
            size="md"
          />
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-50">
              {proposal.freelancerId?.name || 'Professional Freelancer'}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Applied {formatDate(proposal.createdAt)}
            </p>
          </div>
        </div>
        <Badge variant={getStatusVariant(proposal.status)}>
          {proposal.status}
        </Badge>
      </div>

      {/* Cover Letter */}
      <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed border-t border-slate-100 dark:border-slate-800/50 pt-3">
        {proposal.coverLetter}
      </p>

      {/* Proposal Details Grid */}
      <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/50 pt-3">
        <div className="flex items-center gap-1.5">
          <DollarSign size={14} className="text-emerald-500" />
          <span>Bid: {formattedBid}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={14} className="text-primary-500" />
          <span>Duration: {proposal.duration} days</span>
        </div>
      </div>

      {/* Client Actions */}
      {showActions && proposal.status === 'pending' && user?.role === 'client' && (
        <div className="flex gap-2 mt-2 border-t border-slate-100 dark:border-slate-800/50 pt-4">
          <Button
            variant="accent"
            size="sm"
            onClick={handleAccept}
            className="flex-1"
            icon={Check}
          >
            Accept
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReject}
            className="flex-1 hover:text-red-500 hover:border-red-500/30"
            icon={X}
          >
            Reject
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ProposalCard;
