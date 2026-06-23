import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Camera, Plus, Trash, Globe, Briefcase, Award, Award as BadgeCheck, Star, ShieldAlert, Sparkles } from 'lucide-react';
import { updateUser } from '../../redux/slices/authSlice';
import { fetchVerifications } from '../../redux/slices/skillSlice';
import userService from '../../services/userService';
import reputationService from '../../services/reputationService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Avatar from '../../components/common/Avatar';
import AvailabilityCalendar from '../../components/profile/AvailabilityCalendar';

const FreelancerProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { verifications } = useSelector((state) => state.skills);

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState(user?.skills?.join(', ') || '');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [portfolio, setPortfolio] = useState(user?.portfolio || []);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [reputation, setReputation] = useState(null);

  const fetchReputation = async () => {
    if (!user?._id) return;
    try {
      const res = await reputationService.getReputation(user._id);
      setReputation(res.reputation);
    } catch (err) {
      console.error('Failed to fetch reputation', err);
    }
  };

  useEffect(() => {
    dispatch(fetchVerifications());
    fetchReputation();
  }, [dispatch, user?._id]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setSkills(user.skills?.join(', ') || '');
      setPortfolio(user.portfolio || []);
    }
  }, [user]);

  const handleAddPortfolio = () => {
    if (!portfolioLink) return;
    setPortfolio([...portfolio, portfolioLink]);
    setPortfolioLink('');
  };

  const handleRemovePortfolio = (indexToRemove) => {
    setPortfolio(portfolio.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setUploading(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await userService.uploadAvatar(formData);
      dispatch(updateUser(res.user));
      setMessage({ text: 'Profile picture updated successfully', type: 'success' });
    } catch (err) {
      setMessage({ text: err.message || 'Failed to upload profile picture', type: 'danger' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ text: '', type: '' });

    const skillList = skills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '');

    try {
      const res = await userService.updateProfile({
        name,
        bio,
        skills: skillList,
        portfolio,
      });
      dispatch(updateUser(res.user));
      setMessage({ text: 'Profile details saved successfully', type: 'success' });
    } catch (err) {
      setMessage({ text: err.message || 'Failed to save profile details', type: 'danger' });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-950 dark:text-slate-50">My Professional Resume Profile</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          This information will be displayed publicly to clients search and contracts lists.
        </p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl border text-sm font-semibold
          ${message.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
          }
        `}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Card: Photo and Meta */}
        <Card className="flex flex-col items-center justify-center text-center p-6 gap-5 h-fit">
          <div className="relative group cursor-pointer">
            <Avatar src={user?.profileImage} name={user?.name} size="xl" />
            <label className="absolute inset-0 flex items-center justify-center bg-slate-900/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
              <Camera size={24} />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-slate-50">{user?.name}</h2>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 capitalize">{user?.role}</p>
          </div>
           {uploading && (
            <p className="text-xs font-semibold text-primary-500 animate-pulse">Uploading Image...</p>
          )}

          {/* Reputation Score Widget */}
          {reputation && (
            <div className="w-full border-t border-slate-100 dark:border-slate-800/50 pt-4 flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Sparkles size={14} className="text-amber-500" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider">Reputation Center</span>
              </div>
              <div className="relative flex items-center justify-center">
                {/* Circular indicator */}
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-slate-100 dark:text-slate-800"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="currentColor"
                    strokeWidth="5"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 34}
                    strokeDashoffset={((100 - reputation.reputationScore) / 100) * (2 * Math.PI * 34)}
                    className="text-primary-500 transition-all duration-700"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">{reputation.reputationScore}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">/ 100</span>
                </div>
              </div>
              
              <div className="mt-1 flex flex-col items-center gap-1.5">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold tracking-wide shadow-sm border
                  ${reputation.level === 'Elite Freelancer' ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400' : ''}
                  ${reputation.level === 'Top Rated' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400' : ''}
                  ${reputation.level === 'Intermediate' ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400' : ''}
                  ${reputation.level === 'Beginner' ? 'bg-slate-500/10 border-slate-500/20 text-slate-650 dark:text-slate-450' : ''}
                `}>
                  {reputation.level === 'Elite Freelancer' && '👑'}
                  {reputation.level === 'Top Rated' && '⭐'}
                  {reputation.level}
                </span>

                {/* Sub metrics list */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 pt-3 border-t border-slate-100 dark:border-slate-800/30 w-full text-[10px] font-bold text-slate-500">
                  <div className="text-center">
                    <p className="text-slate-400">Completed</p>
                    <p className="text-slate-705 dark:text-slate-300 font-extrabold text-xs mt-0.5">{reputation.projectsCompleted}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400">On Time</p>
                    <p className="text-slate-705 dark:text-slate-300 font-extrabold text-xs mt-0.5">{reputation.onTimeDeliveryPercent}%</p>
                  </div>
                  <div className="text-center mt-2.5">
                    <p className="text-slate-400">Response</p>
                    <p className="text-slate-705 dark:text-slate-300 font-extrabold text-xs mt-0.5">{reputation.avgResponseTime}h</p>
                  </div>
                  <div className="text-center mt-2.5">
                    <p className="text-slate-400">Disputes</p>
                    <p className="text-red-500 font-extrabold text-xs mt-0.5">{reputation.disputesCount}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Verified Skills Section */}
          <div className="w-full border-t border-slate-100 dark:border-slate-800/50 pt-4 flex flex-col gap-3">
            <div className="flex items-center justify-center gap-1 text-slate-700 dark:text-slate-300">
              <BadgeCheck size={16} className="text-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Verified Skills</span>
            </div>
            {verifications.length === 0 ? (
              <p className="text-xs text-slate-400">No verified skills yet.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5 justify-center">
                {verifications.map((v) => (
                  <span
                    key={v._id}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  >
                    {v.skill} ✔
                  </span>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Right Form: Details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <form onSubmit={handleSave} className="flex flex-col gap-5">
              <Input
                label="Full Name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Professional Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your expertise, work history, and goals..."
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-4 text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              <Input
                label="Skills (Comma-separated)"
                id="skills"
                placeholder="React, Node.js, Python, Figma"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                helperText="Separate each skill tag with a comma"
              />

              {/* Portfolio Links */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Portfolio & External Links</label>
                <div className="flex gap-2">
                  <Input
                    id="portfolioLink"
                    placeholder="https://github.com/my-profile"
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    icon={Globe}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddPortfolio}
                    className="shrink-0 rounded-xl"
                  >
                    <Plus size={18} />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {portfolio.map((link, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-800/50"
                    >
                      <Globe size={12} />
                      {link}
                      <button
                        type="button"
                        onClick={() => handleRemovePortfolio(idx)}
                        className="text-red-500 hover:text-red-600 focus:outline-none"
                      >
                        <Trash size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button
                  type="submit"
                  variant="primary"
                  loading={updating}
                  className="px-6"
                >
                  Save Profile
                </Button>
              </div>
            </form>
          </Card>

          {/* Skill Verification Board */}
          <Card>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 mb-4">Skill Verification Board</h3>
            <p className="text-xs text-slate-400 mb-6">
              Complete timed multiple-choice tests (10 questions, 10 minutes) to earn a "Verified ✔" status badge for your core skills. A score of 70% or higher is required.
            </p>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/30">
              {['React', 'Node', 'MongoDB', 'Express', 'JavaScript'].map((skillName) => {
                const verif = verifications.find((v) => v.skill === skillName);
                const isVerified = verif?.verified;

                return (
                  <div key={skillName} className="flex items-center justify-between py-3.5">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{skillName}</span>
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        Verified ✔
                      </span>
                    ) : (
                      <div className="flex items-center gap-3">
                        {verif && (
                          <span className="text-xs text-red-500 font-semibold">
                            Last score: {verif.score}%
                          </span>
                        )}
                        <Link to={`/freelancer/quiz/${skillName}`}>
                          <Button variant="outline" size="sm">
                            Take Quiz
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Availability Calendar */}
          <AvailabilityCalendar />
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;
