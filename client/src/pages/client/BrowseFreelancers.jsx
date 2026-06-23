import React, { useEffect, useState } from 'react';
import userService from '../../services/userService';
import Loader from '../../components/common/Loader';
import Card from '../../components/common/Card';
import Avatar from '../../components/common/Avatar';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Search, Award, Star, MessageSquare, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const BrowseFreelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [verifiedSkill, setVerifiedSkill] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchFreelancersList = async () => {
    setLoading(true);
    try {
      const res = await userService.getFreelancers({
        search,
        verifiedSkill: verifiedSkill || undefined,
        availabilityFilter: availabilityFilter || undefined,
      });
      setFreelancers(res.freelancers || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch freelancers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancersList();
  }, [search, verifiedSkill, availabilityFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">Find Elite Talent</h1>
        <p className="text-slate-550 text-sm">Browse, filter, and connect with verified professional freelancers.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-semibold rounded-xl">
          {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <Card className="flex flex-col md:flex-row gap-4 items-center">
        <Input
          id="searchFreelancer"
          placeholder="Search by name or keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={Search}
          className="flex-1"
        />

        {/* Verified Skill Filter */}
        <div className="flex flex-col gap-1.5 w-full md:w-64">
          <select
            value={verifiedSkill}
            onChange={(e) => setVerifiedSkill(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-semibold text-slate-700 dark:text-slate-350"
          >
            <option value="">All Freelancers</option>
            <option value="React">Verified React Developers</option>
            <option value="Node">Verified Node Developers</option>
            <option value="MongoDB">Verified MongoDB Developers</option>
            <option value="Express">Verified Express Developers</option>
            <option value="JavaScript">Verified JavaScript Developers</option>
          </select>
        </div>

        {/* Availability Filter */}
        <div className="flex flex-col gap-1.5 w-full md:w-64">
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-semibold text-slate-700 dark:text-slate-355"
          >
            <option value="">Any Availability</option>
            <option value="today">Available Today</option>
            <option value="week">Available This Week</option>
          </select>
        </div>
      </Card>

      {/* Freelancers Cards Grid */}
      {loading ? (
        <Loader />
      ) : freelancers.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center bg-white dark:bg-slate-900/50">
          <Briefcase size={40} className="text-slate-400 mb-3" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">No Freelancers Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1">
            We couldn't find any freelancers matching your selection. Try clearing filters or search queries.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.map((free) => (
            <Card key={free._id} className="flex flex-col justify-between h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="space-y-4">
                {/* Meta */}
                <div className="flex items-center gap-3">
                  <Avatar src={free.profileImage} name={free.name} size="md" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-950 dark:text-slate-50 flex items-center gap-1">
                      {free.name}
                      {free.reputation?.level === 'Elite Freelancer' && <span title="Elite Freelancer" className="text-xs">👑</span>}
                      {free.reputation?.level === 'Top Rated' && <span title="Top Rated Freelancer" className="text-xs">⭐</span>}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs">
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star size={12} className="fill-amber-500" />
                        <span>{free.rating || '5.0'}</span>
                      </div>
                      {free.reputation && (
                        <span className="text-[10px] text-slate-455 font-semibold border-l border-slate-200 dark:border-slate-800 pl-2">
                          Rep: <span className="text-primary-500 font-extrabold">{free.reputation.score}/100</span>
                        </span>
                      )}
                    </div>
                    {/* Availability Tag */}
                    <div className="mt-1">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border
                        ${free.todayAvailability?.status === 'Available' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : ''}
                        ${free.todayAvailability?.status === 'Busy' ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400' : ''}
                        ${free.todayAvailability?.status === 'Vacation' ? 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400' : ''}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full block
                          ${free.todayAvailability?.status === 'Available' ? 'bg-emerald-500' : ''}
                          ${free.todayAvailability?.status === 'Busy' ? 'bg-amber-500' : ''}
                          ${free.todayAvailability?.status === 'Vacation' ? 'bg-slate-400' : ''}
                        `} />
                        {free.todayAvailability?.status || 'Available'} Today
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {free.bio || 'This professional has not set a bio statement yet.'}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1">
                  {free.skills?.slice(0, 4).map((s, idx) => (
                    <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-850 text-slate-500">
                      {s}
                    </span>
                  ))}
                  {free.skills?.length > 4 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-850 text-slate-400">
                      +{free.skills.length - 4} more
                    </span>
                  )}
                </div>

                {/* Verified Skills badges */}
                {free.verifiedSkills && free.verifiedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1 items-center pt-1">
                    <Award size={13} className="text-emerald-500 shrink-0" />
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mr-1">Verified:</span>
                    {free.verifiedSkills.map((vSkill, idx) => (
                      <span key={idx} className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {vSkill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button & Chat */}
              <div className="border-t border-slate-100 dark:border-slate-800/50 pt-4 mt-6 flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    const sorted = [free._id, free.clientId || 'me'].sort();
                    navigate(`/client/messages`);
                  }}
                  icon={MessageSquare}
                >
                  Contact
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseFreelancers;
