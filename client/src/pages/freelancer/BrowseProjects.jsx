import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../redux/slices/projectSlice';
import ProjectCard from '../../components/project/ProjectCard';
import ProjectFilters from '../../components/project/ProjectFilters';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import { Briefcase, AlertCircle } from 'lucide-react';

const BrowseProjects = () => {
  const dispatch = useDispatch();
  const { projects, pagination, loading, error } = useSelector((state) => state.projects);
  const [filters, setFilters] = useState({ page: 1, limit: 9 });

  useEffect(() => {
    dispatch(fetchProjects(filters));
  }, [dispatch, filters]);

  const handleApplyFilters = (newFilters) => {
    setFilters({
      ...filters,
      ...newFilters,
      page: 1, // Reset to first page when filtering
    });
  };

  const handleResetFilters = () => {
    setFilters({ page: 1, limit: 9 });
  };

  const handlePageChange = (newPage) => {
    setFilters({
      ...filters,
      page: newPage,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">Browse Freelance Projects</h1>
        <p className="text-slate-500 text-sm">Explore open contracts, filter by keywords, and submit proposals.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ProjectFilters
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Projects Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <Loader />
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center bg-white dark:bg-slate-900/50">
              <AlertCircle size={40} className="text-slate-400 mb-3" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200">No Projects Found</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-1">
                We couldn't find any projects matching your search criteria. Try removing some filters or change keywords.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    actionText="View details"
                    actionLink={`/freelancer/projects/${project._id}`}
                  />
                ))}
              </div>

              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseProjects;
