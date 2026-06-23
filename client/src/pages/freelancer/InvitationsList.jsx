import React, { useEffect, useState } from 'react';
import teamService from '../../services/teamService';
import Loader from '../../components/common/Loader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import { Mail, Check, X, Calendar, DollarSign, User } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const InvitationsList = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const res = await teamService.getMyInvitations();
      setInvitations(res.invitations || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch team invitations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleRespond = async (id, accept) => {
    setError('');
    setSuccess('');
    try {
      await teamService.respondToInvitation(id, accept);
      setSuccess(accept ? 'Invitation accepted successfully! Joined team.' : 'Invitation declined.');
      fetchInvitations();
    } catch (err) {
      setError(err.message || 'Failed to respond to invitation');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50 flex items-center gap-2">
          <Mail className="text-primary-500" />
          Team Hiring Invitations
        </h1>
        <p className="text-slate-500 text-sm">
          Review and respond to agency/client offers to join collaborative team workspaces.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-semibold rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-semibold rounded-xl">
          {success}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : invitations.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <Mail size={40} className="text-slate-350 mb-3" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">No New Invites</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1">
            You haven't received any team invitations. Check back later or optimize your profile filters.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {invitations.map((inv) => (
            <Card key={inv._id} className="p-6 flex flex-col md:flex-row justify-between gap-6 hover:shadow-lg transition-all duration-300">
              <div className="space-y-4 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                      {inv.projectId?.title || 'Untitled Project'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Position Offered:</span>
                      <Badge variant="primary" className="text-[9px] font-extrabold tracking-wider">{inv.role}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs px-2.5 py-0.5 flex items-center gap-1 font-bold">
                      <DollarSign size={12} /> Budget: ₹{inv.projectId?.budget || 'Hourly'}
                    </Badge>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {inv.projectId?.description}
                </p>

                {/* Client Meta info */}
                <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/30">
                  <Avatar src={inv.clientId?.profileImage} name={inv.clientId?.name} size="xs" />
                  <div className="text-[10px] font-bold">
                    <p className="text-slate-800 dark:text-slate-300">Invited by {inv.clientId?.name}</p>
                    <p className="text-slate-400 mt-0.5">{inv.clientId?.email}</p>
                  </div>
                  {inv.projectId?.deadline && (
                    <span className="ml-auto text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <Calendar size={12} /> Project Deadline: {formatDate(inv.projectId.deadline)}
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex md:flex-col justify-end gap-2.5 self-center shrink-0 w-full md:w-auto">
                <Button
                  variant="primary"
                  size="sm"
                  icon={Check}
                  className="flex-1 md:w-36"
                  onClick={() => handleRespond(inv._id, true)}
                >
                  Accept Offer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={X}
                  className="flex-1 md:w-36 hover:border-red-500/20 hover:text-red-500"
                  onClick={() => handleRespond(inv._id, false)}
                >
                  Decline
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvitationsList;
