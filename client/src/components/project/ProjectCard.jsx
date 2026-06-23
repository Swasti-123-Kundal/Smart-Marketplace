import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, DollarSign, Users } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatCurrency, formatDate, truncateText } from '../../utils/formatters';

const ProjectCard = ({ project, showActions = true, actionText = 'View Details', actionLink }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'open':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formattedBudget = formatCurrency(project.budget);
  const formattedDeadline = formatDate(project.deadline);

  return (
    <Card hoverable className="flex flex-col h-full">
      {/* Top Section */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50 line-clamp-1">
          {project.title}
        </h3>
        <Badge variant={getStatusVariant(project.status)}>
          {getStatusLabel(project.status)}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 flex-grow">
        {truncateText(project.description, 160)}
      </p>

      {/* Metas Grid */}
      <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-5 border-t border-slate-100 dark:border-slate-800/50 pt-4">
        <div className="flex items-center gap-1.5">
          <DollarSign size={16} className="text-emerald-500" />
          <span>Budget: {formattedBudget}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={16} className="text-primary-500" />
          <span>Due: {formattedDeadline}</span>
        </div>
        {project.proposalCount !== undefined && (
          <div className="flex items-center gap-1.5 col-span-2">
            <Users size={16} className="text-blue-500" />
            <span>Applications: {project.proposalCount} proposals</span>
          </div>
        )}
      </div>

      {/* Skills Required */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {project.skillsRequired?.slice(0, 4).map((skill, idx) => (
          <span
            key={idx}
            className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          >
            {skill}
          </span>
        ))}
        {project.skillsRequired?.length > 4 && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">
            +{project.skillsRequired.length - 4} more
          </span>
        )}
      </div>

      {/* Action Button */}
      {showActions && actionLink && (
        <Link to={actionLink} className="w-full mt-auto">
          <button className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-primary-500/10">
            {actionText}
          </button>
        </Link>
      )}
    </Card>
  );
};

export default ProjectCard;
