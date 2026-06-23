import React, { useEffect, useState } from 'react';
import reputationService from '../../services/reputationService';
import Loader from '../../components/common/Loader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Search, Trophy, Medal, Star, Briefcase, Award, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [sort, setSort] = useState('score');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await reputationService.getLeaderboard({
        search,
        level: level || undefined,
        sort,
      });
      setLeaderboard(res.leaderboard || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [search, level, sort]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50 flex items-center gap-2">
            <Trophy className="text-amber-500" />
            Global Talent Leaderboard
          </h1>
          <p className="text-slate-500 text-sm">
            Discover and connect with top-tier freelancers ranked by WorkSphere reputation scores.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-semibold rounded-xl">
          {error}
        </div>
      )}

      {/* Filter panel */}
      <Card className="flex flex-col md:flex-row gap-4 items-center">
        <Input
          id="searchTalent"
          placeholder="Search top talent by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={Search}
          className="flex-1"
        />

        {/* Filter Tier */}
        <div className="flex flex-col gap-1 w-full md:w-56">
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3.5 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="">All Tiers</option>
            <option value="Elite Freelancer">Elite Freelancer 👑</option>
            <option value="Top Rated">Top Rated ⭐</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Beginner">Beginner</option>
          </select>
        </div>

        {/* Sort option */}
        <div className="flex flex-col gap-1 w-full md:w-56">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3.5 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="score">Sort by Reputation Score</option>
            <option value="projects">Sort by Projects Completed</option>
            <option value="rating">Sort by Average Rating</option>
          </select>
        </div>
      </Card>

      {loading ? (
        <Loader />
      ) : leaderboard.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-200 dark:border-slate-850 rounded-2xl text-center bg-white dark:bg-slate-900/50">
          <Medal size={40} className="text-slate-400 mb-3" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">No Leaders Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1">
            We couldn't find any freelancers matching your selection. Try clearing filters or search queries.
          </p>
        </div>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full border-collapse text-left text-xs text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 uppercase font-bold text-[10px] tracking-wider text-slate-400">
              <tr>
                <th className="py-4 px-6 text-center w-16">Rank</th>
                <th className="py-4 px-6">Freelancer Details</th>
                <th className="py-4 px-6 text-center">Projects</th>
                <th className="py-4 px-6 text-center">Avg Rating</th>
                <th className="py-4 px-6 text-center">Reputation Score</th>
                <th className="py-4 px-6">Badge / Tier</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {leaderboard.map((item, index) => {
                const freeUser = item.userId;
                const rank = index + 1;

                return (
                  <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/35 transition-colors">
                    <td className="py-4 px-6 text-center">
                      {rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/10 text-amber-500 font-extrabold text-sm border border-amber-500/20">
                          🥇
                        </span>
                      ) : rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300/20 text-slate-500 font-extrabold text-sm border border-slate-300/30">
                          🥈
                        </span>
                      ) : rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-500/10 text-orange-600 font-extrabold text-sm border border-orange-500/20">
                          🥉
                        </span>
                      ) : (
                        <span className="font-extrabold text-slate-400 dark:text-slate-600">#{rank}</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar src={freeUser.profileImage} name={freeUser.name} size="sm" />
                        <div>
                          <p className="font-extrabold text-slate-850 dark:text-slate-205">{freeUser.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 max-w-xs">{freeUser.bio || 'Professional Freelancer'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-slate-700 dark:text-slate-350">
                      <div className="flex items-center justify-center gap-1.5">
                        <Briefcase size={12} className="text-slate-400" />
                        <span>{item.projectsCompleted}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-slate-700 dark:text-slate-350">
                      <div className="flex items-center justify-center gap-1">
                        <Star size={12} className="fill-amber-500 text-amber-500" />
                        <span>{item.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-sm font-black text-primary-500">{item.reputationScore}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">/100</span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        variant={
                          item.level === 'Elite Freelancer' ? 'success' :
                          item.level === 'Top Rated' ? 'primary' :
                          item.level === 'Intermediate' ? 'info' : 'secondary'
                        }
                      >
                        {item.level.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        variant="primary"
                        size="sm"
                        icon={MessageSquare}
                        onClick={() => {
                          navigate(`/client/messages`);
                        }}
                      >
                        Contact
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};

export default Leaderboard;
